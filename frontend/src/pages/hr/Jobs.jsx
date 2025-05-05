import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import HRNavbar from "../../components/HRNavbar";
import ViewJobs from "../../components/jobs/ViewJobs";
import CreateJob from "../../components/jobs/CreateJob";
import ArchivedJobs from "../../components/jobs/ArchivedJobs";
import JobFormModal from "../../components/modals/JobFormModal";
import Toast from "../../components/notifications/Toast";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { useJobs } from "../../hooks/useJobs";
import { usePagination } from "../../hooks/usePagination";
import { useToast } from "../../hooks/useToast";
import { useJobModals } from "../../hooks/useJobModals";
import { useSearchParams } from "react-router-dom";
import { jobsApi } from "../../services/api/jobsApi";
import ViewApplicants from "../../components/jobs/ViewApplicants2";
import RankCandidates from "../../components/jobs/RankCandidates";

const Jobs = () => {
  const {
    jobs,
    isLoading: loading,
    createJob,
    updateJob,
    archiveJob,
    restoreJob,
  } = useJobs(true); // Pass true for employer view
  const { getPaginatedData } = usePagination();
  const { showMessage, messageType, message, showToast } = useToast();
  const {
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedJob,
    setSelectedJob,
    jobToDelete,
    setJobToDelete,
  } = useJobModals();

  const [activeTab, setActiveTab] = useState("view");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [applicantFilter, setApplicantFilter] = useState("all");
  const [jobIdFilter, setJobIdFilter] = useState(null);
  const [applicationIdFilter, setApplicationIdFilter] = useState(null);

  const [searchParams] = useSearchParams();

  const getFilteredJobs = (jobs) => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_skill?.some((skill) =>
          skill.skill.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (selectedFilter === "all") return matchesSearch;
      if (selectedFilter === "recent") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return matchesSearch && new Date(job.created_at) >= oneWeekAgo;
      }
      if (selectedFilter === "remote") {
        return (
          matchesSearch && job.employment_type.toLowerCase().includes("remote")
        );
      }
      if (selectedFilter === "fulltime") {
        return (
          matchesSearch &&
          job.employment_type.toLowerCase().includes("full-time")
        );
      }
      if (selectedFilter === "parttime") {
        return (
          matchesSearch &&
          job.employment_type.toLowerCase().includes("part-time")
        );
      }

      return matchesSearch;
    });
  };

  const {
    currentItems: currentJobs,
    totalPages,
    currentPage,
    handlePageChange,
  } = getPaginatedData(
    getFilteredJobs(
      jobs.filter((job) =>
        activeTab === "archived"
          ? job.status === "archived"
          : job.status !== "archived"
      )
    )
  );

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["view", "create", "archived", "applicants", "rank"].includes(tabParam)) {
      setActiveTab(tabParam);

      if (tabParam === "applicants") {
        const jobIdParam = searchParams.get("jobId");
        const applicationIdParam = searchParams.get("applicationId");
        
        if (jobIdParam) {
          setJobIdFilter(jobIdParam);
          setApplicantFilter("all");
        }

        if (applicationIdParam) {
          setApplicationIdFilter(applicationIdParam);
        }
      }
    }
  }, [searchParams]);

  const handleJobCreated = async (jobData) => {
    try {
      await createJob(jobData);
      showToast("success", "Job post created successfully!");
    } catch (error) {
      showToast("error", error.message || "Error creating job post");
    }
  };

  const handleEditJob = async (jobId) => {
    try {
      const jobDetails = await jobsApi.getJobPostingDetails(jobId);
      console.log("Raw Job Details:", jobDetails);

      // Map API response to form data structure using exact field names
      const mappedJobDetails = {
        job_title: jobDetails.job_title || "",
        company_name: jobDetails.company_name || "",
        company_logo_url: jobDetails.company_logo_url || null,
        location: jobDetails.location || "",
        employment_type: jobDetails.employment_type || "Full-time",
        salary_range: jobDetails.salary_range || "",
        applicants_needed: jobDetails.applicants_needed || "",
        company_description: jobDetails.company_description || "",
        about_company: jobDetails.about_company || "",
        responsibilities: Array.isArray(jobDetails.job_responsibility)
          ? jobDetails.job_responsibility.map((r) => r.responsibility)
          : [""],
        qualifications: Array.isArray(jobDetails.job_qualification)
          ? jobDetails.job_qualification.map((q) => q.qualification)
          : [""],
        skills: Array.isArray(jobDetails.job_skill)
          ? jobDetails.job_skill.map((s) => s.skill)
          : [""],
        id: jobDetails.id,
      };

      console.log("Mapped Job Details:", mappedJobDetails);
      setSelectedJob(mappedJobDetails);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching job details:", error);
      showToast("error", "Error fetching job details");
    }
  };

  // Update handleJobEdited to match the field names
  const handleJobEdited = async (updatedJobData) => {
    try {
      // No need to transform the field names since they already match
      const formattedData = {
        job_title: updatedJobData.job_title,
        company_name: updatedJobData.company_name,
        company_logo_url: updatedJobData.company_logo_url,
        location: updatedJobData.location,
        employment_type: updatedJobData.employment_type,
        salary_range: updatedJobData.salary_range,
        applicants_needed: updatedJobData.applicants_needed,
        company_description: updatedJobData.company_description,
        about_company: updatedJobData.about_company,
        responsibilities: updatedJobData.responsibilities,
        qualifications: updatedJobData.qualifications,
        skills: updatedJobData.skills,
      };

      await updateJob({
        id: selectedJob.id,
        data: formattedData,
      });

      setShowEditModal(false);
      setSelectedJob(null);
      showToast("success", "Job post updated successfully!");
    } catch (error) {
      console.error("Error updating job:", error);
      showToast("error", error.message || "Error updating job post");
    }
  };

  // Rename handleDeleteJob to handleArchiveJob
  const handleArchiveJob = async (jobId, e) => {
    e?.stopPropagation(); // Prevent event bubbling
    try {
      setJobToDelete(jobId);
      setShowDeleteModal(true);
    } catch (error) {
      console.error("Error preparing to archive job:", error);
      showToast("error", "Error preparing to archive job");
    }
  };

  // Rename handleConfirmDelete to handleConfirmArchive
  const handleConfirmArchive = async () => {
    try {
      await archiveJob(jobToDelete);
      setShowDeleteModal(false);
      setJobToDelete(null);
      showToast("success", "Job post archived successfully!");
    } catch (error) {
      console.error("Error archiving job:", error);
      showToast("error", error.message || "Error archiving job post");
    }
  };

  // Add restore functionality
  const handleRestore = async (jobId) => {
    try {
      await restoreJob(jobId);
      showToast("success", "Job post restored successfully!");
    } catch (error) {
      console.error("Error restoring job:", error);
      showToast("error", error.message || "Error restoring job post");
    }
  };

  // Add a new function to handle clicking on a job card
  const handleViewJobApplicants = (jobId) => {
    setJobIdFilter(jobId);
    setActiveTab("applicants");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HRNavbar />
      <div className="pt-16 px-4">
        <div className="max-w-7xl mx-auto py-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("view")}
                className={`${
                  activeTab === "view"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                View Jobs
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`${
                  activeTab === "create"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Create Job
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`${
                  activeTab === "archived"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Archived Jobs
              </button>
              <button
                onClick={() => setActiveTab("applicants")}
                className={`${
                  activeTab === "applicants"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Applicants
              </button>
              <button
                onClick={() => setActiveTab("rank")}
                className={`${
                  activeTab === "rank"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Rank Candidates
              </button>
            </nav>
          </div>

          {/* Search and Filter */}
          {activeTab !== "create" && activeTab !== "applicants" && activeTab !== "rank" && (
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs by title, company, or skills"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-shrink-0">
                  <select
                    className="w-full md:w-48 border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    <option value="all">All Jobs</option>
                    <option value="recent">Most Recent</option>
                    <option value="remote">Remote</option>
                    <option value="fulltime">Full Time</option>
                    <option value="parttime">Part Time</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "view" && (
              <ViewJobs
                jobs={jobs.filter((job) => job.status !== "archived")}
                loading={loading}
                currentJobs={currentJobs}
                handleEditJob={handleEditJob}
                handleDeleteJob={handleArchiveJob}
                handleViewJobApplicants={handleViewJobApplicants}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            )}
            {activeTab === "create" && (
              <CreateJob onJobCreated={handleJobCreated} />
            )}
            {activeTab === "archived" && (
              <ArchivedJobs
                archivedJobs={currentJobs}
                handleRestore={handleRestore}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                loading={loading}
              />
            )}
            {activeTab === "applicants" && (
              <ViewApplicants
                initialFilter={applicantFilter}
                jobIdFilter={jobIdFilter}
                applicationIdFilter={applicationIdFilter}
                onClearFilters={() => {
                  setJobIdFilter(null);
                  setApplicationIdFilter(null);
                }}
              />
            )}
            {activeTab === "rank" && <RankCandidates />}
          </div>
        </div>
      </div>

      {/* Keep the modals */}
      <Toast show={showMessage} type={messageType} message={message} />

      <JobFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedJob(null);
        }}
        onSubmit={handleJobEdited}
        isEditing={true}
        initialData={selectedJob}
      />

      {/* Update the confirmation modal text */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setJobToDelete(null);
        }}
        onConfirm={handleConfirmArchive}
        title="Archive Job Posting"
        message="Are you sure you want to archive this job posting? It will be moved to the archived jobs section."
      />
    </div>
  );
};

export default Jobs;
