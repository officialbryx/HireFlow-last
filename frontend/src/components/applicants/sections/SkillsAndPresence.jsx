import { CodeBracketIcon, LinkIcon } from "@heroicons/react/24/outline";

export const SkillsAndPresence = ({ skills = [], linkedinUrl, websites = [] }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <h3 className="font-semibold text-lg mb-4 text-gray-800">
      <span className="flex items-center">
        <CodeBracketIcon className="h-5 w-5 mr-2 text-gray-500" />
        Skills & Online Presence
      </span>
    </h3>

    <div className="mb-6">
      <h4 className="font-medium text-gray-700 mb-3">Skills</h4>
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-gray-500 italic">No skills listed</p>
        ) : (
          skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))
        )}
      </div>
    </div>

    <div className="pt-4 border-t">
      <h4 className="font-medium text-gray-700 mb-3">Online Presence</h4>
      {!linkedinUrl && websites.length === 0 ? (
        <p className="text-gray-500 italic">No online profiles provided</p>
      ) : (
        <div className="space-y-2">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              LinkedIn Profile
            </a>
          )}
          {websites.map((url, index) => (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              {url.replace(/(^\w+:|^)\/\//, "").split("/")[0]}
            </a>
          ))}
        </div>
      )}
    </div>
  </div>
);