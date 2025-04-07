import { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import { applicationsApi } from "../../services/api/applicationsApi";
import { supabase } from "../../services/supabaseClient"; // Add this import
import ApplicantsList from "../applicants/ApplicantsList";
import ApplicantDetails from "../applicants/ApplicantDetails";
import PdfModal from "../applicants/modals/PdfModal";
import { getBadgeColor, formatDate } from "../applicants/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function ViewApplicants({
  initialFilter = "all",
  jobIdFilter = null,
  onClearFilters,
}) {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [activeTab, setActiveTab] = useState("details");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [companyFilter, setCompanyFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState(jobIdFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Edit to increase number of displayed applicants per page
  const [userId, setUserId] = useState(null);

  // Get query client instance
  const queryClient = useQueryClient();

  // Get current user ID
  useEffect(() => {
    async function getCurrentUser() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user && !error) {
        setUserId(data.user.id);
      }
    }
    getCurrentUser();
  }, []);

  // Update filters from props
  useEffect(() => {
    if (initialFilter !== "all") {
      setStatusFilter(initialFilter);
    }
  }, [initialFilter]);

  useEffect(() => {
    if (jobIdFilter) {
      setJobFilter(jobIdFilter);
    }
  }, [jobIdFilter]);

  // Define query key based on all filters
  const applicantsQueryKey = [
    "applicants",
    currentPage,
    pageSize,
    statusFilter,
    companyFilter,
    jobFilter,
    searchTerm,
    userId, // Add userId to the query key so it refreshes when user changes
  ];

  // Fetch applicants with React Query
  const {
    data: applicantsData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: applicantsQueryKey,
    queryFn: async () => {
      // Build filters object
      const filters = {
        status: statusFilter !== "all" ? statusFilter : null,
        company: companyFilter !== "all" ? companyFilter : null,
        job_id: jobFilter || null,
        search: searchTerm || null,
        creator_id: userId, // Add creator_id to filter by job owner
      };

      // This assumes you've updated applicationsApi.fetchApplications to support pagination
      const result = await applicationsApi.fetchApplications(
        currentPage,
        pageSize,
        filters
      );
      return result;
    },
    keepPreviousData: true, // Keep showing previous data while new data is loading
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId, // Only run query when userId is available
  });

  // Extract data from query result
  const applicants = applicantsData?.data || [];
  const totalPages = applicantsData?.totalPages || 1;
  const companies = [...new Set(applicants.map((app) => app.company))].filter(
    Boolean
  );

  // Prefetch next page for smoother experience
  useEffect(() => {
    if (currentPage < totalPages) {
      // Create query key for next page
      const nextPageQueryKey = [...applicantsQueryKey];
      nextPageQueryKey[1] = currentPage + 1; // Update page number

      // Prefetch next page
      queryClient.prefetchQuery({
        queryKey: nextPageQueryKey,
        queryFn: async () => {
          const filters = {
            status: statusFilter !== "all" ? statusFilter : null,
            company: companyFilter !== "all" ? companyFilter : null,
            job_id: jobFilter || null,
            search: searchTerm || null,
            creator_id: userId, // Add creator_id to filter by job owner
          };
          return applicationsApi.fetchApplications(
            currentPage + 1,
            pageSize,
            filters
          );
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [currentPage, totalPages, queryClient, applicantsQueryKey, userId]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, companyFilter, jobFilter, searchTerm]);

  // Handle applicant selection with cached resume analysis
  const handleSelectApplicant = async (applicant) => {
    setSelectedApplicant(applicant);
    setActiveTab("details");

    if (applicant?.resume_url) {
      // Try to get cached analysis first
      const analysisKey = ["resumeAnalysis", applicant.resume_url];
      const cachedAnalysis = queryClient.getQueryData(analysisKey);

      if (cachedAnalysis) {
        setAnalysis(cachedAnalysis);
      } else {
        try {
          // Fetch and cache the analysis
          const analysisResult = await queryClient.fetchQuery({
            queryKey: analysisKey,
            queryFn: () =>
              applicationsApi.analyzeApplicantResume(applicant.resume_url),
            staleTime: 30 * 60 * 1000, // 30 minutes cache
          });
          setAnalysis(analysisResult);
        } catch (error) {
          console.error("Error analyzing resume:", error);
          setAnalysis(null);
        }
      }
    } else {
      setAnalysis(null);
    }
  };

  // Add this function
  const handleApplicantUpdated = async (applicantId, updates = {}) => {
    // First update the local state to immediately reflect changes
    if (selectedApplicant && selectedApplicant.id === applicantId) {
      setSelectedApplicant((prev) => ({
        ...prev,
        ...updates,
      }));
    }

    // Then invalidate the query to refresh data from server
    await queryClient.invalidateQueries(applicantsQueryKey);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setJobFilter(null);
    setStatusFilter("all");
    setCompanyFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
    if (onClearFilters) onClearFilters();
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Applicants Review</h1>

        <div className="flex gap-6">
          <div className="w-1/3">
            {/* Use the ApplicantsList component instead of inline JSX */}
            <ApplicantsList
              applicants={applicants}
              isLoading={isLoading}
              isFetching={isFetching}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              companyFilter={companyFilter}
              setCompanyFilter={setCompanyFilter}
              jobFilter={jobFilter}
              setJobFilter={setJobFilter}
              companies={companies}
              selectedApplicant={selectedApplicant}
              handleSelectApplicant={handleSelectApplicant}
              getBadgeColor={getBadgeColor}
              formatDate={formatDate}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              clearAllFilters={clearAllFilters}
              onClearFilters={onClearFilters}
            />
          </div>

          <ApplicantDetails
            selectedApplicant={selectedApplicant}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            analysis={analysis}
            getBadgeColor={getBadgeColor}
            formatDate={formatDate}
            setShowPdfModal={setShowPdfModal}
            onApplicantUpdated={handleApplicantUpdated} // Add this prop
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
