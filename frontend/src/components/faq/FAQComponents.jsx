import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { HighlightedText } from "./HighlightedText";
import { getIconByName } from "../../utils/iconUtils"; // Create this utility
import { useState } from "react";

// Update the SearchHeader component to make the search bar more visible

export function SearchHeader({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative mt-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search FAQ..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="block w-full pl-10 pr-4 py-3 rounded-lg bg-white border-2 border-blue-300 shadow-md 
        text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white 
        focus:border-transparent transition-all duration-200"
        aria-label="Search frequently asked questions"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-500 hover:text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

// Update FAQSection component to use getTextSegments instead of highlightMatches
export function FAQSection({
  section,
  sectionIndex,
  isActive,
  toggleSection,
  activeQuestions,
  toggleQuestion,
  getTextSegments,
}) {
  const SectionIcon = getIconByName(section.icon);

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden shadow-sm bg-white">
      {/* Section header */}
      <button
        onClick={() => toggleSection(sectionIndex)}
        className={`flex justify-between items-center w-full p-4 text-left ${
          isActive ? "bg-blue-50" : "bg-white"
        } hover:bg-blue-50 transition-colors`}
        aria-expanded={isActive ? "true" : "false"}
        aria-controls={`section-${sectionIndex}`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`${
              isActive ? "text-blue-600" : "text-gray-500"
            } transition-colors`}
          >
            {SectionIcon ? <SectionIcon className="w-5 h-5" /> : null}
          </div>
          <h2
            className={`font-semibold ${
              isActive ? "text-blue-800" : "text-gray-800"
            } transition-colors`}
          >
            <HighlightedText segments={getTextSegments(section.title)} />
          </h2>
        </div>
        {isActive ? (
          <ChevronUpIcon className="h-5 w-5 text-blue-600" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Section content - collapsible */}
      <div
        id={`section-${sectionIndex}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isActive ? "max-h-[2000px]" : "max-h-0"
        }`}
        role="region"
        aria-labelledby={`section-heading-${sectionIndex}`}
      >
        <div className="p-4 pt-0 bg-white">
          <div className="space-y-2">
            {section.questions.map((item, questionIndex) => (
              <FAQQuestion
                key={questionIndex}
                question={item}
                isActive={activeQuestions[`${sectionIndex}-${questionIndex}`]}
                toggle={() => toggleQuestion(sectionIndex, questionIndex)}
                getTextSegments={getTextSegments}
                sectionIndex={sectionIndex}
                questionIndex={questionIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQQuestion({
  question,
  isActive,
  toggle,
  getTextSegments,
  sectionIndex,
  questionIndex,
}) {
  return (
    <div className="border-t first:border-0 border-gray-100">
      {/* Question */}
      <button
        onClick={toggle}
        className={`flex justify-between items-center w-full p-3 text-left rounded-md mt-2 ${
          isActive
            ? "bg-gray-50 text-blue-700"
            : "hover:bg-gray-50 text-gray-800"
        }`}
        aria-expanded={isActive ? "true" : "false"}
        aria-controls={`question-${sectionIndex}-${questionIndex}`}
      >
        <h3 className="text-base font-medium pr-6">
          <HighlightedText segments={getTextSegments(question.q)} />
        </h3>
        {isActive ? (
          <ChevronUpIcon className="h-4 w-4 flex-shrink-0 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 flex-shrink-0 text-gray-500" />
        )}
      </button>

      {/* Answer */}
      <div
        id={`question-${sectionIndex}-${questionIndex}`}
        className={`overflow-hidden transition-all duration-200 ${
          isActive ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <p className="text-gray-600 p-3 pt-1 pl-6 rounded-md bg-gray-50">
          <HighlightedText segments={getTextSegments(question.a)} />
        </p>
      </div>
    </div>
  );
}

export function EmptySearchResult() {
  return (
    <div className="text-center py-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-12 h-12 mx-auto text-gray-300 mb-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <p className="text-gray-500 font-medium">No matching questions found</p>
      <p className="text-gray-400 mt-1">
        Try using different keywords or browsing the categories
      </p>
    </div>
  );
}

export function FAQHeader({ title, userType }) {
  const manualPath =
    userType === "hr" ? "/hr-user-manual.pdf" : "/user-manual.pdf";
  const manualText = userType === "hr" ? "HR Manual" : "Applicant Manual";

  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-semibold flex items-center">
        <QuestionMarkCircleIcon className="h-7 w-7 mr-2" />
        {title}
      </h1>
      <a
        href={manualPath}
        download
        className="inline-flex items-center px-4 py-2 border border-white rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-gray-100 transition-colors"
      >
        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
        Download {manualText}
      </a>
    </div>
  );
}
