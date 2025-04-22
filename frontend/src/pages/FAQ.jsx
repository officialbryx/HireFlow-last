import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import { jobSeekerFaqData } from "../data/jobSeekerFaqData";
import { useFAQSearch } from "../hooks/useFAQSearch";
import {
  SearchHeader,
  FAQSection,
  EmptySearchResult,
  FAQHeader,
} from "../components/faq/FAQComponents";

const FAQ = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState({});

  // Memoize the FAQ sections
  const faqSections = useMemo(() => jobSeekerFaqData, []);

  const { searchQuery, setSearchQuery, filteredSections, getTextSegments } =
    useFAQSearch(faqSections, setActiveSection, setActiveQuestions);

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  const toggleQuestion = (sectionIndex, questionIndex) => {
    setActiveQuestions((prev) => {
      const key = `${sectionIndex}-${questionIndex}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <FAQHeader title="Job Seeker FAQ" userType="applicant" />
              <SearchHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            <div className="p-6">
              {searchQuery && filteredSections.length === 0 && (
                <EmptySearchResult />
              )}

              <div className="space-y-4">
                {filteredSections.map((section, sectionIndex) => (
                  <FAQSection
                    key={sectionIndex}
                    section={section}
                    sectionIndex={sectionIndex}
                    isActive={activeSection === sectionIndex}
                    toggleSection={toggleSection}
                    activeQuestions={activeQuestions}
                    toggleQuestion={toggleQuestion}
                    getTextSegments={getTextSegments}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-500">
            Still have questions?{" "}
            <a
              href="mailto:support@hireflow.com"
              className="text-blue-600 hover:underline"
            >
              Contact our support team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
