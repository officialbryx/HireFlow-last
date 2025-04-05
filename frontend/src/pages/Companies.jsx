import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { companiesData } from "../data/companyData";
import {
  BuildingOffice2Icon,
  MapPinIcon,
  UsersIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  LinkIcon,
  GlobeAmericasIcon,
  ChatBubbleBottomCenterIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Companies = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 6;

  // Add useEffect to reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredCompanies = companiesData.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current companies
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Top Companies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our curated list of industry-leading companies and find your
            perfect career match
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by company name, industry or location..."
                className="block w-full pl-12 pr-4 py-3 border-0 ring-1 ring-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Featured Companies
          </h2>
          <p className="text-gray-600 font-medium">
            Showing{" "}
            <span className="text-blue-600">{filteredCompanies.length}</span>{" "}
            companies
          </p>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-gray-100"
              onClick={() => handleCompanyClick(company)}
            >
              {/* Company Card Header */}
              <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                <div className="absolute -bottom-10 left-6">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-4 border-white bg-white flex items-center justify-center shadow-md">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Company Card Content */}
              <div className="p-6 pt-12">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {company.name}
                  </h2>
                  <p className="text-blue-600 font-medium">
                    {company.industry}
                  </p>
                </div>

                <p className="text-gray-700 mb-6 line-clamp-3">
                  {company.description}
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{company.employees} employees</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BuildingOffice2Icon className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Founded in {company.founded}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <a
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {company.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredCompanies.length > companiesPerPage && (
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BuildingOffice2Icon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No companies found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-600 font-medium hover:text-blue-800"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Company Details Modal */}
        {selectedCompany && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-5 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCompany.name}
                </h2>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Company Header Banner */}
              <div className="h-36 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                <div className="absolute -bottom-16 left-8">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white bg-white flex items-center justify-center shadow-lg">
                    <img
                      src={selectedCompany.logo}
                      alt={selectedCompany.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 pt-20">
                {/* Company Overview Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    Company Overview
                  </h3>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Website</span>
                      <a
                        href={`https://${selectedCompany.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedCompany.website}
                      </a>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Industry</span>
                      <span className="text-gray-900">
                        {selectedCompany.industry}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Company size
                      </span>
                      <span className="text-gray-900">
                        {selectedCompany.employees} employees
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Primary location
                      </span>
                      <span className="text-gray-900">
                        {selectedCompany.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="mb-10">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    About
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedCompany.about}
                    </p>
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Connect With Us
                  </h3>
                  <div className="flex items-center gap-6">
                    <a
                      href={selectedCompany.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 p-2 rounded-lg hover:bg-blue-50"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href={selectedCompany.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-400 transition-colors duration-300 p-2 rounded-lg hover:bg-blue-50"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      <span>Twitter</span>
                    </a>
                    <a
                      href={selectedCompany.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 p-2 rounded-lg hover:bg-blue-50"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook</span>
                    </a>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
