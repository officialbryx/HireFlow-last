import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";

const CompanyDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with actual API call
  const company = {
    // ...existing company data...
    benefits: [
      "Health Insurance",
      "Remote Work",
      "401k",
      "Professional Development",
    ],
    culture:
      "We foster an innovative and inclusive environment where creativity thrives.",
    reviews: [
      {
        id: 1,
        rating: 4,
        title: "Great work environment",
        position: "Software Engineer",
        pros: "Good benefits, great colleagues",
        cons: "Work can be demanding at times",
        date: "2023-05-15",
      },
      // Add more reviews...
    ],
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) =>
      index < rating ? (
        <StarIcon key={index} className="h-5 w-5 text-yellow-400" />
      ) : (
        <StarOutline key={index} className="h-5 w-5 text-gray-300" />
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="w-24 h-24 rounded-lg mr-6"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {company.name}
              </h1>
              <p className="text-lg text-gray-600">{company.industry}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  About {company.name}
                </h2>
                <p className="text-gray-600">{company.description}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Company Culture</h2>
                <p className="text-gray-600">{company.culture}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Company Details</h2>
                <div className="space-y-3">
                  <p className="text-gray-600">Founded: {company.founded}</p>
                  <p className="text-gray-600">Size: {company.employees}</p>
                  <p className="text-gray-600">Industry: {company.industry}</p>
                  <p className="text-gray-600">Location: {company.location}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                <ul className="list-disc list-inside space-y-2">
                  {company.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-600">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {company.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <h3 className="text-lg font-semibold mt-2">
                      {review.title}
                    </h3>
                    <p className="text-gray-600">{review.position}</p>
                  </div>
                  <span className="text-gray-500">{review.date}</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-600">Pros</h4>
                    <p className="text-gray-600">{review.pros}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600">Cons</h4>
                    <p className="text-gray-600">{review.cons}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;
