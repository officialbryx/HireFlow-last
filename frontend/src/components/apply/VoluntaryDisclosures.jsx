import React from "react";

const VoluntaryDisclosures = ({ formData, setFormData }) => {
  const handleAcceptTerms = () => {
    setFormData((prev) => ({
      ...prev,
      termsAccepted: !prev.termsAccepted,
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Terms and Conditions</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">RECRUITMENT PRIVACY NOTICE</h3>
        <div className="bg-gray-50 p-4 rounded-md text-sm space-y-4 max-h-96 overflow-y-auto">
          <p className="font-medium">I signify and understand that:</p>

          <ol className="list-decimal pl-4 space-y-2">
            <li>
              My information will be collected and processed for the following
              purposes:
              <ul className="list-disc pl-4 mt-2">
                <li>
                  <span className="font-medium">
                    Basic Identifiers and Contact Information
                  </span>{" "}
                  – To verify my identity and determine my legal eligibility to
                  enter into and formalize an employment contract within the
                  requirements of the law; to maintain proper communications
                  with me during the application process and throughout my
                  employment, should my application be successful; and to
                  identify potential conflicts of interest arising from my
                  employment.
                </li>
                <li>
                  <span className="font-medium">
                    Assessment of Requisite Skills
                  </span>{" "}
                  – To determine whether I possess the requisite skills for the
                  position I am applying for.
                </li>
                <li>
                  <span className="font-medium">Financial Records</span> – To
                  process and manage my compensation and benefits, including
                  loan and insurance coverage entitlements, should my
                  application be successful.
                </li>
                <li>
                  <span className="font-medium">Administrative Records</span> –
                  Records on disciplinary matters, grievances, queries and
                  complaints, absences, and termination of employment or
                  engagement (including provision of references) during my
                  employment, should my application be successful.
                </li>
                <li>
                  <span className="font-medium">
                    Other Technical Information
                  </span>{" "}
                  – To monitor my compliance with the company’s Acceptable Use
                  Policy among other policies and to optimize network and system
                  performance, should my application be successful.
                </li>
                <li>
                  <span className="font-medium">
                    Company-Generated Information
                  </span>{" "}
                  – Identification information, access credentials, performance
                  metrics, learning and developmental progress, and
                  closed-circuit television footage at the workplace, and work
                  assignment records as part of workforce management and
                  development.
                </li>
              </ul>
            </li>
            <li>
              Should my application be successful, my Basic Identifiers and
              Contact Information as well as Company-Generated Information may
              be shared with the company for the purpose of enabling contact
              and collaboration subject to proper documentation.
            </li>
            <li>
              The processing of my data may be outsourced or contracted to
              external parties, even without my further consent, to fulfill any
              of the purposes described above including the verification of the
              existence, truthfulness, and/or accuracy of the information I will
              provide and in compliance with government requirements.
            </li>
            <li>
              My data may be analyzed for internal consumption and reporting.
            </li>
            <li>
              My information will be protected and retained in accordance with
              the Data Privacy Act of 2012 and the Privacy Policy of the company
              that I am applying to.
            </li>
          </ol>

          <p className="font-medium">
            I specifically provide my consent for the collection and processing
            of my information for the following purposes:
          </p>

          <ol className="list-decimal pl-4 space-y-2">
            <li>
              Sensitive personal identifiable information to further verify my
              identity and to determine my legal eligibility to enter into and
              formalize an employment contract within the requirements of the
              law;
            </li>
            <li>
              Information regarding my educational and employment background
              included in my curriculum vitae and/or resume to determine whether
              I am qualified for the position I am applying for;
            </li>
            <li>
              Government-issued identification to comply with existing
              employment-related laws and regulations;
            </li>
            <li>
              Administrative, civil, and/or criminal cases and other government
              clearances to determine if my employment may compromise the
              company’s ethical standards;
            </li>
            <li>
              Information that I may have disclosed of relevant individuals
              and/or external parties, who I have notified and obtained the
              consent of, in relation to this application.
            </li>
          </ol>
          <p>
            In case I am referring on behalf of an applicant, I warrant that I
            have been expressly authorized by the applicant to disclose his/her
            information for the purposes described above, including the
            collection and processing of information that requires the
            applicant’s explicit consent.
          </p>
          <p>
            I authorize and consent for the company to retain the
            information I provided for two years as part of its recruitment
            database and share them within the company for future
            consideration in new employment opportunities.
          </p>
          <p>
            I understand that I may withhold my consent or later on withdraw it
            at any time. Without such consent, however, the company will not
            be able to continue with my application or employment.
          </p>
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={handleAcceptTerms}
            className="mt-1"
            required
          />
          <p className="text-sm text-gray-500">
            I have read and understood the foregoing.
            <span className="text-red-500"> *</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoluntaryDisclosures;
