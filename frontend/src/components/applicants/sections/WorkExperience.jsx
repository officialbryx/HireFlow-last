import { BriefcaseIcon } from "@heroicons/react/24/outline";

export const WorkExperience = ({ workExperience, previousEmployment, formatDate, company }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-lg text-gray-800">
        <span className="flex items-center">
          <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500" />
          Work Experience
        </span>
      </h3>
    </div>

    {workExperience?.length === 0 ? (
      <p className="text-gray-500 italic">No work experience provided</p>
    ) : (
      <div className="space-y-6">
        {workExperience?.map((exp, index) => (
          <div
            key={index}
            className={index < workExperience.length - 1 ? "pb-6 border-b" : ""}
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{exp.title}</h4>
                <p className="text-gray-700">{exp.company}</p>
                <p className="text-gray-500 text-sm">{exp.location}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                {formatDate(exp.start_date)} — {exp.current ? "Present" : formatDate(exp.end_date)}
              </div>
            </div>
            {exp.description && (
              <p className="mt-2 text-gray-600 text-sm">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    )}

    {previousEmployment?.previously_employed && (
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-medium text-gray-700 mb-2">
          Previous Employment at {company}
        </h4>
        {previousEmployment.employee_id && (
          <p className="text-sm text-gray-600">
            Employee ID: {previousEmployment.employee_id}
          </p>
        )}
        {previousEmployment.manager && (
          <p className="text-sm text-gray-600">
            Previous Manager: {previousEmployment.manager}
          </p>
        )}
      </div>
    )}
  </div>
);