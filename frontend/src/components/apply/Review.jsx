import React from "react";

const Review = ({ formData }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-center">Review</h2>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/* Personal Information */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-center">My Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Full Name:</span>
            <p>
              {`${formData.givenName} ${formData.middleName} ${formData.familyName} ${formData.suffix}`.trim()}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Address:</span>
            <p>{formData.givenAddress}</p>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <p>{formData.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>
            <p>
              {`${formData.phoneCode} ${formData.phoneNumber} ${formData.phoneDeviceType}`}{" "}
            </p>
          </div>
        </div>
      </section>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/* Work Experience */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-center">My Experience</h3>
        <h3 className="text-lg font-semibold">Work Experience</h3>
        {formData.noWorkExperience ? (
          <p className="text-gray-500">No work experience</p>
        ) : (
          <div className="space-y-4">
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h4 className="font-medium">
                  Work Experience 1: {exp.jobTitle}
                </h4>
                <h4 className="font-medium">Job Title: {exp.jobTitle}</h4>
                <p className="text-sm text-gray-600">Company: {exp.company}</p>
                <p className="text-sm text-gray-600">Location: {exp.company}</p>
                <p className="text-sm text-gray-600">
                  I currently work here: {exp.company}
                </p>
                <p className="text-sm text-gray-500">
                  From
                  {`${exp.fromDate} -  To ${
                    exp.currentWork ? "Present" : exp.toDate
                  }`}
                </p>
                <p className="text-sm mt-2">
                  Role Description: {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/* Education */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="border p-4 rounded-md">
            <h4 className="font-medium">Education 1</h4>
            <h4 className="font-medium">School or University: {edu.school}</h4>
            <p className="text-sm text-gray-600">Degree: {`${edu.degree}`}</p>
            <p className="text-sm text-gray-600">
              Field of Study: {`${edu.fieldOfStudy}`}
            </p>
            <p className="text-sm">Overall Result (GPA): {edu.gpa}</p>
            <p className="text-sm text-gray-500">
              From - To (Actual or Expected):{" "}
              {`${edu.fromYear} - ${edu.toYear}`}
            </p>
          </div>
        ))}
      </section>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/* Skills */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Skills</h3>
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

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/* Resume */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Resume/CV</h3>
        <p className="text-sm">
          Resume: {formData.resume ? formData.resume.name : "No file uploaded"}
        </p>
      </section>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/*Websites */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Websites</h3>
        <p className="text-sm">Add any relevant websites.</p>
        <p className="text-sm">
          Websites:{" "}
          {formData.resume ? formData.resume.name : "No file uploaded"}
        </p>
      </section>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/*Websites */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Social Network URLs</h3>
        <p className="text-sm">
          Add your Linkedin url . Format should be https://
        </p>
        <p className="text-sm">
          LinkedIn URL:{" "}
          {formData.resume ? formData.resume.name : "No file uploaded"}
        </p>
      </section>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/* Application Questions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-center">
          Application Questions
        </h3>
        <div>
          <p>
            Have you been previously employed by Globe? (If you are a current
            employee, please apply on the Workday site instead)
          </p>
          <p>
            {`${formData.givenName} ${formData.middleName} ${formData.familyName} ${formData.suffix}`.trim()}
          </p>
        </div>
        <div>
          <p>Was your application previously processed with Globe Telecom?*</p>
          <p>{formData.givenAddress}</p>
        </div>
        <div>
          <p>
            Have you been directly employed by Globe, any of the Globe
            subsidiaries or other Ayala companies?*
          </p>{" "}
          <p>{formData.email}</p>
        </div>
        <div>
          <p>
            Do you have relatives working with Globe, any of the Globe
            subsidiaries or other Ayala companies?*
          </p>{" "}
          <p>{formData.email}</p>
        </div>
        <div>
          <p>
            Do you have any relatives working with other Telecom companies?*
          </p>{" "}
          <p>{formData.email}</p>
        </div>
        <div>
          <p>Do you have a bond with your current employer?*</p>{" "}
          <p>{formData.email}</p>
        </div>
        <div>
          <p>Do you have a non-compete clause?*</p> <p>{formData.email}</p>
        </div>
        <div>
          <p>Are you / will you be undergoing international studies?*</p>{" "}
          <p>{formData.email}</p>
        </div>
        <div>
          <p>Are you applying for a VISA?*</p> <p>{formData.email}</p>
        </div>
      </section>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/* Application Questions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-center">
          Voluntary Disclosures
        </h3>
        <div>
          <p>Terms and Conditions</p>
          <p>I have read and understood the foregoing.</p>
          <p>Yes</p>
        </div>
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
