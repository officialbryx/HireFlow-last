import React from "react";

const Review = ({ formData }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Review Your Application</h2>

      {/* Personal Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Full Name:</span>
            <p>
              {`${formData.givenName} ${formData.middleName} ${formData.familyName} ${formData.suffix}`.trim()}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Country:</span>
            <p>{formData.country}</p>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <p>{formData.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>
            <p>{`${formData.phoneCode} ${formData.phoneNumber}`}</p>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Work Experience</h3>
        {formData.noWorkExperience ? (
          <p className="text-gray-500">No work experience</p>
        ) : (
          <div className="space-y-4">
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h4 className="font-medium">{exp.jobTitle}</h4>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{`${exp.fromDate} - ${
                  exp.currentWork ? "Present" : exp.toDate
                }`}</p>
                <p className="text-sm mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Education */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="border p-4 rounded-md">
            <h4 className="font-medium">{edu.school}</h4>
            <p className="text-sm text-gray-600">{`${edu.degree} in ${edu.fieldOfStudy}`}</p>
            <p className="text-sm text-gray-500">{`${edu.fromYear} - ${edu.toYear}`}</p>
            <p className="text-sm">GPA: {edu.gpa}</p>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Resume */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">Uploaded Documents</h3>
        <p className="text-sm">
          Resume: {formData.resume ? formData.resume.name : "No file uploaded"}
        </p>
      </section>

      <div className="border-t pt-6 mt-8">
        <p className="text-sm text-gray-500">
          Please review all information carefully before submitting your
          application. By clicking Submit, you confirm that all provided
          information is accurate and complete.
        </p>
      </div>
    </div>
  );
};

export default Review;
