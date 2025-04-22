import { useState, useMemo } from "react";
import HRNavbar from "../../components/HRNavbar";
import { faqData } from "../../data/faqData";
import { useFAQSearch } from "../../hooks/useFAQSearch";
import {
  SearchHeader,
  FAQSection,
  EmptySearchResult,
  FAQHeader,
} from "../../components/faq/FAQComponents";

const FAQ = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState({});

  // Memoize the FAQ sections
  const faqSections = useMemo(() => faqData, []);

  // Use the custom hook for search functionality
  const {
    searchQuery,
    setSearchQuery,
    filteredSections,
    getTextSegments, // renamed from highlightMatches
  } = useFAQSearch(faqSections, setActiveSection, setActiveQuestions);

  // Toggle section expansion
  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  // Toggle question expansion
  const toggleQuestion = (sectionIndex, questionIndex) => {
    setActiveQuestions((prev) => {
      const key = `${sectionIndex}-${questionIndex}`;
      const newState = { ...prev };

      // Toggle this question
      newState[key] = !prev[key];
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HRNavbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header with search */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <FAQHeader title="Frequently Asked Questions" userType="hr" />
              <SearchHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* FAQ content */}
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

              {filteredSections.length > 0 && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      if (activeSection !== null) {
                        setActiveSection(null);
                        setActiveQuestions({});
                      } else {
                        setActiveSection(0);
                      }
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {activeSection !== null
                      ? "Collapse all"
                      : "Expand first section"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-500">
            Can&apos;t find what you&apos;re looking for?{" "}
            <a
              href="mailto:support@hireflow.com"
              className="text-blue-600 hover:underline"
            >
              Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
