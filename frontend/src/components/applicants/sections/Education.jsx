import { AcademicCapIcon } from "@heroicons/react/24/outline";

export const Education = ({ education = [], formatDate }) => {
  // Helper function to format dates as years
  const formatYear = (dateString) => {
    if (!dateString) return "";
    // Extract year from the date string (assumes format like "MM/YYYY" or full date)
    return dateString.split("/").pop() || dateString;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">
        <span className="flex items-center">
          <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-500" />
          Education
        </span>
      </h3>

      {education.length === 0 ? (
        <p className="text-gray-500 italic">
          No education information provided
        </p>
      ) : (
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div
              key={index}
              className={index < education.length - 1 ? "pb-6 border-b" : ""}
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {edu.degree} in {edu.field_of_study}
                  </h4>
                  <p className="text-gray-700">{edu.school}</p>
                  {edu.location && (
                    <p className="text-gray-500 text-sm">{edu.location}</p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  {formatYear(edu.from_year)} —{" "}
                  {edu.current ? "Present" : formatYear(edu.to_year)}
                </div>
              </div>
              {edu.description && (
                <p className="mt-2 text-gray-600 text-sm">{edu.description}</p>
              )}
              {edu.gpa && (
                <p className="mt-1 text-gray-600 text-sm">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
