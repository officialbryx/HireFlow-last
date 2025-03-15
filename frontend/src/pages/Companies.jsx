import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  BuildingOffice2Icon,
  MapPinIcon,
  UsersIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const companies = [
    {
      id: 1,
      name: "TechCorp Solutions",
      logo: "https://via.placeholder.com/100",
      industry: "Technology",
      location: "San Francisco, CA",
      employees: "1000-5000",
      website: "www.techcorp.com",
      description:
        "Leading provider of enterprise software solutions and digital transformation services.",
      founded: "2005",
    },
    {
      id: 2,
      name: "Green Energy Innovations",
      logo: "https://via.placeholder.com/100",
      industry: "Renewable Energy",
      location: "Austin, TX",
      employees: "500-1000",
      website: "www.greeninnovate.com",
      description:
        "Pioneering sustainable energy solutions for a better tomorrow.",
      founded: "2010",
    },
    {
      id: 3,
      name: "FinTech Dynamics",
      logo: "https://via.placeholder.com/100",
      industry: "Financial Technology",
      location: "New York, NY",
      employees: "2000-5000",
      website: "www.fintechdynamics.com",
      description:
        "Revolutionary financial technology solutions for modern banking.",
      founded: "2012",
    },
    {
      id: 4,
      name: "HealthCare Plus",
      logo: "https://via.placeholder.com/100",
      industry: "Healthcare",
      location: "Boston, MA",
      employees: "5000-10000",
      website: "www.healthcareplus.com",
      description: "Innovative healthcare solutions and patient care services.",
      founded: "2000",
    },
    {
      id: 5,
      name: "DataSmart Analytics",
      logo: "https://via.placeholder.com/100",
      industry: "Data Analytics",
      location: "Seattle, WA",
      employees: "500-1000",
      website: "www.datasmartanalytics.com",
      description:
        "Advanced data analytics and business intelligence solutions.",
      founded: "2015",
    },
    // Add more companies here... (continue with similar pattern up to 50)
  ];

  // Search functionality
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Featured Companies
          </h1>

          {/* Search Bar */}
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search companies by name, industry, or location..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-600 mb-4">
          Showing {filteredCompanies.length} companies
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-16 h-16 rounded-lg mr-4 object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {company.name}
                    </h2>
                    <p className="text-gray-600">{company.industry}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{company.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UsersIcon className="h-5 w-5 mr-2" />
                    <span>{company.employees} employees</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BuildingOffice2Icon className="h-5 w-5 mr-2" />
                    <span>Founded in {company.founded}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GlobeAltIcon className="h-5 w-5 mr-2" />
                    <a
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
