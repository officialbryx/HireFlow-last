import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const QuestionItem = ({ question, answer, isValid }) => {
  const isYesNoQuestion =
    typeof answer === "string" &&
    (answer.toLowerCase() === "yes" || answer.toLowerCase() === "no");

  const isYes = isYesNoQuestion && answer.toLowerCase() === "yes";
  const isNo = isYesNoQuestion && answer.toLowerCase() === "no";

  // Capitalize first letter of answer
  const formattedAnswer = answer
    ? answer.charAt(0).toUpperCase() + answer.slice(1).toLowerCase()
    : "";

  return (
    <div className="flex items-start gap-3 pb-4 last:pb-0">
      <div
        className={
          isYes
            ? "text-emerald-500"
            : isNo
            ? "text-rose-500"
            : isValid
            ? "text-emerald-500"
            : "text-rose-500"
        }
      >
        {isYes ? (
          <CheckCircleIcon className="h-5 w-5" />
        ) : isNo ? (
          <XCircleIcon className="h-5 w-5" />
        ) : isValid ? (
          <CheckCircleIcon className="h-5 w-5" />
        ) : (
          <XCircleIcon className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-gray-900">{question}</h4>
        </div>
        <p className="text-sm text-gray-600">
          {formattedAnswer ? (
            <span
              className={`font-medium ${
                isYes
                  ? "text-emerald-600"
                  : isNo
                  ? "text-rose-600"
                  : isValid
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {formattedAnswer}
            </span>
          ) : (
            <span className="italic text-gray-400">No answer provided</span>
          )}
        </p>
      </div>
    </div>
  );
};

export const ScreeningQuestions = ({ questions = {} }) => {
  if (!questions || Object.keys(questions).length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="text-center text-gray-500">
          <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-2" />
          <p>No screening questions available</p>
        </div>
      </div>
    );
  }

  // Question mapping from IDs to full text
  const questionTextMap = {
    previouslyProcessed:
      "Have you been previously employed by this company (If you are a current employee, please apply on the Workday site instead)",
    previouslyProcessedWithCompany:
      "Was your application previously processed with this company?",
    directlyEmployed: "Have you been directly employed by this company?",
    relativesInCompany:
      "Do you have relatives working with this company, any of the company subsidiaries, or other companies?",
    relativesInIndustry:
      "Do you have any relatives working with other related industry companies?",
    currentEmployerBond: "Do you have a bond with your current employer?",
    nonCompete: "Do you have a non-compete clause?",
    filipinoCitizen: "Are you a Filipino / dual Filipino citizen?",
    internationalStudies:
      "Are you / will you be undergoing international studies?",
    applyVisa: "Are you applying for a VISA?",
  };

  // Transform questions object into array with full question text
  const questionsList = Object.entries(questions).map(([id, details]) => ({
    question: questionTextMap[id] || id,
    answer: typeof details === "object" ? details.answer : details,
    isValid: details.valid !== undefined ? details.valid : true,
  }));

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-lg mb-6 text-gray-800 flex items-center">
        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-gray-500" />
        Screening Questions
      </h3>

      <div className="divide-y divide-gray-100">
        {questionsList.map((q, index) => (
          <div key={index} className="py-4 first:pt-0 last:pb-0">
            <QuestionItem
              question={q.question}
              answer={q.answer}
              isValid={q.isValid}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
