import { 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from "@heroicons/react/24/outline";

const QuestionItem = ({ question, answer, isRequired, isValid }) => {
  // Determine if the answer is yes/no
  const isYesNoQuestion = typeof answer === 'string' && 
    (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'no');
  
  const isYes = isYesNoQuestion && answer.toLowerCase() === 'yes';
  const isNo = isYesNoQuestion && answer.toLowerCase() === 'no';

  return (
    <div className="flex items-start gap-3 pb-4 last:pb-0">
      <div className={isYes ? "text-emerald-500" : isNo ? "text-rose-500" : (isValid ? "text-emerald-500" : "text-rose-500")}>
        {isYes ? (
          <CheckCircleIcon className="h-5 w-5" />
        ) : isNo ? (
          <XCircleIcon className="h-5 w-5" />
        ) : (
          isValid ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-gray-900">{question}</h4>
          {isRequired && (
            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-xs font-medium rounded-full">
              Required
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {answer ? (
            <span className={`font-medium ${
              isYes ? 'text-emerald-600' : 
              isNo ? 'text-rose-600' : 
              (isValid ? 'text-emerald-600' : 'text-rose-600')
            }`}>
              {answer}
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

  // Transform questions object into array for easier mapping
  const questionsList = Object.entries(questions).map(([question, details]) => ({
    question: question
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^./, str => str.toUpperCase()),
    answer: typeof details === 'object' ? details.answer : details,
    isRequired: details.required || false,
    isValid: details.valid !== undefined ? details.valid : true
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
              isRequired={q.isRequired}
              isValid={q.isValid}
            />
          </div>
        ))}
      </div>

      {/* Summary section */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Required questions answered: {
              questionsList.filter(q => q.isRequired && q.isValid).length
            }/{questionsList.filter(q => q.isRequired).length}
          </span>
          <span className={`px-2 py-1 rounded-full font-medium ${
            questionsList.every(q => !q.isRequired || q.isValid)
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}>
            {questionsList.every(q => !q.isRequired || q.isValid)
              ? 'All Required Questions Answered'
              : 'Missing Required Answers'
          }
          </span>
        </div>
      </div>
    </div>
  );
};