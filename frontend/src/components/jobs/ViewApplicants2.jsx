import React, { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import { supabase } from "../../services/supabaseClient";
import { analyzeResume } from "../../services/resumeAnalysis";
import { applicationsApi } from "../../services/api/applicationsApi";
import HRNavbar from "../HRNavbar";
import ApplicantsList from "../applicants/ApplicantsList";
import ApplicantDetails from "../applicants/ApplicantDetails";
import PdfModal from "../applicants/modals/PdfModal";
import { getBadgeColor, formatDate } from "../applicants/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function ViewApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("details");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [companyFilter, setCompanyFilter] = useState('all');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    const uniqueCompanies = [...new Set(applicants.map(app => app.company))].filter(Boolean);
    setCompanies(uniqueCompanies);
  }, [applicants]);

  const fetchApplicants = async () => {
    try {
      const data = await applicationsApi.fetchApplications();
      setApplicants(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectApplicant = async (applicant) => {
    try {
      setLoading(true);
      setSelectedApplicant(applicant);
      setActiveTab("details");
      
      if (applicant.resume_url) {
        const analysisResult = await applicationsApi.analyzeApplicantResume(applicant.resume_url);
        setAnalysis(analysisResult);
      }
    } catch (error) {
      console.error("Error selecting applicant:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredApplicants = () => {
    return applicants.filter((applicant) => {
      const matchesSearch =
        searchTerm === "" ||
        applicant.personal_info?.given_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.personal_info?.family_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.company?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
      const matchesCompany = companyFilter === "all" || applicant.company === companyFilter;

      return matchesSearch && matchesStatus && matchesCompany;
    });
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <HRNavbar />
      <div className="max-w-7xl mx-auto px-4 ">
        <h1 className="text-2xl font-bold mb-6">Applicants Review</h1>
        <div className="flex gap-6">
          <ApplicantsList
            applicants={getFilteredApplicants()}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            companyFilter={companyFilter}
            setCompanyFilter={setCompanyFilter}
            companies={companies}
            selectedApplicant={selectedApplicant}
            handleSelectApplicant={handleSelectApplicant}
            getBadgeColor={getBadgeColor}
          />
          <ApplicantDetails
            selectedApplicant={selectedApplicant}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            analysis={analysis}
            getBadgeColor={getBadgeColor}
            formatDate={formatDate}
            setShowPdfModal={setShowPdfModal}
          />
        </div>
      </div>
      {showPdfModal && (
        <PdfModal
          url={applicationsApi.getResumeUrl(selectedApplicant?.resume_url)}
          onClose={() => {
            setShowPdfModal(false);
            setPageNumber(1);
          }}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          numPages={numPages}
          setNumPages={setNumPages}
        />
      )}
    </div>
  );
}
