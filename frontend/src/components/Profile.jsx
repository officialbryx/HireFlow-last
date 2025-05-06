import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient"; // Updated import path
import Navbar from "./Navbar";
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import DateMonthPicker from "./DateMonthPicker";

const suffixOptions = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "Jr",
  "Sr",
];

const countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cape Verde" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "GD", name: "Grenada" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KR", name: "South Korea" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MX", name: "Mexico" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "NA", name: "Namibia" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SG", name: "Singapore" },
  { code: "ZA", name: "South Africa" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TH", name: "Thailand" },
  { code: "TR", name: "Turkey" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" },
  { code: "ZW", name: "Zimbabwe" },
];

const degreeOptions = [
  "High School",
  "Associate of Arts",
  "Bachelor of Science",
  "Bachelor of Arts",
  "Master of Arts",
  "Master of Science",
  "Master of Business Administration",
  "Doctor of Philosophy",
  "Juris Doctor",
];

const FormSection = ({ icon, title, children, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center space-x-3 mb-6">
      {icon}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
    <div className="space-y-4">{children}</div>
  </div>
);

const FormField = ({ label, required, children, className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isPhoneValid = (number) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(number.replace(/\D/g, ""));
};

const isPostalCodeValid = (code) => {
  return /^\d+$/.test(code);
};

const isTextOnly = (text) => {
  return /^[A-Za-z\s-]+$/.test(text);
};

const Profile = () => {
  const [formData, setFormData] = useState({
    workExperience: [
      {
        jobTitle: "",
        company: "",
        location: "",
        currentWork: false,
        fromDate: "",
        toDate: "",
        description: "",
      },
    ],
    education: [
      {
        school: "",
        degree: "",
        fieldOfStudy: "",
        gpa: "",
        fromYear: "",
        toYear: "",
      },
    ],
    skills: [],
    noWorkExperience: false,
    resume_url: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all data in parallel for better performance
      const [profileResult, workExpResult, eduResult, skillsResult] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("work_experiences").select("*").eq("user_id", user.id),
          supabase.from("education").select("*").eq("user_id", user.id),
          supabase.from("skills").select("skill_name").eq("user_id", user.id),
        ]);

      // Handle any errors
      if (profileResult.error) throw profileResult.error;
      if (workExpResult.error) throw workExpResult.error;
      if (eduResult.error) throw eduResult.error;
      if (skillsResult.error) throw skillsResult.error;

      // Format work experience data
      const formattedWorkExp = workExpResult.data.map((exp) => ({
        jobTitle: exp.job_title || "",
        company: exp.company || "",
        location: exp.location || "",
        currentWork: exp.current_work || false,
        fromDate: exp.from_date ? formatDateFromDB(exp.from_date) : "",
        toDate: exp.to_date ? formatDateFromDB(exp.to_date) : "",
        description: exp.description || "",
      }));

      // Format education data
      const formattedEdu = eduResult.data.map((edu) => ({
        school: edu.school || "",
        degree: edu.degree || "",
        fieldOfStudy: edu.field_of_study || "",
        gpa: edu.gpa || "",
        fromYear: edu.from_date ? formatDateFromDB(edu.from_date) : "",
        toYear: edu.to_date ? formatDateFromDB(edu.to_date) : "",
      }));

      // Update form data with fetched data, including email from auth user
      setFormData({
        givenName: profileResult.data?.first_name || "",
        middleName: profileResult.data?.middle_name || "",
        familyName: profileResult.data?.last_name || "",
        suffix: profileResult.data?.suffix || "",
        country: profileResult.data?.country || "",
        street: profileResult.data?.street || "",
        additionalAddress: profileResult.data?.additional_address || "",
        city: profileResult.data?.city || "",
        province: profileResult.data?.province || "",
        postalCode: profileResult.data?.postal_code || "",
        phoneType: profileResult.data?.phone_type || "",
        phoneCode: profileResult.data?.phone_code || "",
        phoneNumber: profileResult.data?.phone_number || "",
        noWorkExperience: profileResult.data?.no_work_experience || false,
        email: user.email || "", // Add email from auth user
        workExperience:
          formattedWorkExp.length > 0
            ? formattedWorkExp
            : [
                {
                  jobTitle: "",
                  company: "",
                  location: "",
                  currentWork: false,
                  fromDate: "",
                  toDate: "",
                  description: "",
                },
              ],
        education:
          formattedEdu.length > 0
            ? formattedEdu
            : [
                {
                  school: "",
                  degree: "",
                  fieldOfStudy: "",
                  gpa: "",
                  fromYear: "",
                  toYear: "",
                },
              ],
        skills: skillsResult.data?.map((s) => s.skill_name) || [],
        resume_url: profileResult.data?.resume_url || "",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Add helper function to format dates from DB
  const formatDateFromDB = (dbDate) => {
    if (!dbDate) return "";
    const date = new Date(dbDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;

    if (
      ["givenName", "middleName", "familyName", "city", "province"].includes(
        name
      )
    ) {
      finalValue = value.replace(/[^A-Za-z\s-]/g, "");
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    setFieldErrors((prev) => ({
      ...prev,
      [`workExperience.${index}.${field}`]: undefined,
    }));

    if (field === "jobTitle") {
      value = value.replace(/[^A-Za-z\s-]/g, "");
    }

    const newWorkExperience = [...formData.workExperience];
    if (field === "fromDate" || field === "toDate") {
      value = value ? value : null;
    }
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
    setFormData((prev) => ({ ...prev, workExperience: newWorkExperience }));
  };

  const handleEducationChange = (index, field, value) => {
    setFieldErrors((prev) => ({
      ...prev,
      [`education.${index}.${field}`]: undefined,
    }));

    if (["school", "fieldOfStudy"].includes(field)) {
      value = value.replace(/[^A-Za-z\s-]/g, "");
    } else if (field === "gpa") {
      const gpaRegex = /^\d*\.?\d{0,2}$/;
      if (value && (!gpaRegex.test(value) || parseFloat(value) > 4)) {
        return;
      }
    }

    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData((prev) => ({ ...prev, education: newEducation }));
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          jobTitle: "",
          company: "",
          location: "",
          currentWork: false,
          fromDate: "",
          toDate: "",
          description: "",
        },
      ],
    }));
  };

  const deleteWorkExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: "",
          degree: "",
          fieldOfStudy: "",
          gpa: "",
          fromYear: "",
          toYear: "",
        },
      ],
    }));
  };

  const handleSkillsChange = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!formData.skills.includes(newSkill) && isTextOnly(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleViewResume = () => {
    if (formData.resume_url) {
      window.open(formData.resume_url, "_blank");
    }
  };

  const handleSave = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Upload resume if it exists and is a file
      let resume_url = formData.resume_url; // Keep existing URL if no new file
      if (formData.resume && formData.resume instanceof File) {
        const fileExt = formData.resume.name.split(".").pop();
        const fileName = `${user.id}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(filePath, formData.resume);

        if (uploadError) throw uploadError;

        // Get public URL for the uploaded file
        const {
          data: { publicUrl },
        } = supabase.storage.from("resumes").getPublicUrl(filePath);

        resume_url = publicUrl;
      }

      // Update profile with resume URL
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.givenName || "",
          middle_name: formData.middleName || "",
          last_name: formData.familyName || "",
          suffix: formData.suffix || "",
          country: formData.country || "",
          street: formData.street || "",
          additional_address: formData.additionalAddress || "",
          city: formData.city || "",
          province: formData.province || "",
          postal_code: formData.postalCode || "",
          phone_type: formData.phoneType || "",
          phone_code: formData.phoneCode || "",
          phone_number: formData.phoneNumber || "",
          no_work_experience: formData.noWorkExperience || false,
          resume_url: resume_url, // Add resume URL to profile update
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Delete existing work experiences
      await supabase.from("work_experiences").delete().eq("user_id", user.id);

      // Insert new work experiences with properly formatted dates
      if (!formData.noWorkExperience && formData.workExperience.length > 0) {
        const formattedWorkExperience = formData.workExperience.map((exp) => {
          // Parse the MM/YYYY format and create a valid date
          const fromParts = exp.fromDate ? exp.fromDate.split("/") : null;
          const toParts = exp.toDate ? exp.toDate.split("/") : null;

          const fromDate = fromParts
            ? `${fromParts[1]}-${fromParts[0]}-01`
            : null;
          const toDate = exp.currentWork
            ? null
            : toParts
            ? `${toParts[1]}-${toParts[0]}-01`
            : null;

          return {
            user_id: user.id,
            job_title: exp.jobTitle || "",
            company: exp.company || "",
            location: exp.location || "",
            current_work: exp.currentWork || false,
            from_date: fromDate,
            to_date: toDate,
            description: exp.description || "",
          };
        });

        const { error: workError } = await supabase
          .from("work_experiences")
          .insert(formattedWorkExperience);

        if (workError) throw workError;
      }

      // Delete existing education records
      await supabase.from("education").delete().eq("user_id", user.id);

      // Insert new education records with properly formatted dates
      if (formData.education.length > 0) {
        const formattedEducation = formData.education.map((edu) => {
          // Parse the MM/YYYY format and create a valid date
          const fromParts = edu.fromYear ? edu.fromYear.split("/") : null;
          const toParts = edu.toYear ? edu.toYear.split("/") : null;

          const fromDate = fromParts
            ? `${fromParts[1]}-${fromParts[0]}-01`
            : null;
          const toDate = toParts ? `${toParts[1]}-${toParts[0]}-01` : null;

          return {
            user_id: user.id,
            school: edu.school || "",
            degree: edu.degree || "",
            field_of_study: edu.fieldOfStudy || "",
            gpa: edu.gpa || null,
            from_date: fromDate,
            to_date: toDate,
          };
        });

        const { error: eduError } = await supabase
          .from("education")
          .insert(formattedEducation);

        if (eduError) throw eduError;
      }

      // Delete existing skills
      await supabase.from("skills").delete().eq("user_id", user.id);

      // Insert new skills
      if (formData.skills.length > 0) {
        const { error: skillsError } = await supabase.from("skills").insert(
          formData.skills.map((skill) => ({
            user_id: user.id,
            skill_name: skill,
          }))
        );

        if (skillsError) throw skillsError;
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const inputStyles = (fieldName) =>
    `w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 ${
      fieldErrors && fieldErrors[fieldName]
        ? "border-red-500 ring-1 ring-red-500"
        : "border-gray-300"
    }`;

  const selectStyles = (fieldName) =>
    `w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 bg-white appearance-none ${
      fieldErrors && fieldErrors[fieldName]
        ? "border-red-500 ring-1 ring-red-500"
        : "border-gray-300"
    }`;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Manage your personal information for applications
                </p>
              </div>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>

            <div className="space-y-8">
              <FormSection
                icon={<UserCircleIcon className="h-6 w-6 text-blue-500" />}
                title="Personal Information"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Given Name" required>
                    <input
                      type="text"
                      name="givenName"
                      value={formData.givenName || ""}
                      onChange={handleChange}
                      className={inputStyles("givenName")}
                      placeholder="Enter your given name"
                    />
                  </FormField>

                  <FormField label="Middle Name">
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName || ""}
                      onChange={handleChange}
                      className={inputStyles("middleName")}
                      placeholder="Enter your middle name"
                    />
                  </FormField>

                  <FormField label="Family Name" required>
                    <input
                      type="text"
                      name="familyName"
                      value={formData.familyName || ""}
                      onChange={handleChange}
                      className={inputStyles("familyName")}
                      placeholder="Enter your family name"
                    />
                  </FormField>

                  <FormField label="Suffix">
                    <select
                      name="suffix"
                      value={formData.suffix || ""}
                      onChange={handleChange}
                      className={selectStyles("suffix")}
                    >
                      <option value="">Select suffix</option>
                      {suffixOptions.map((suffix) => (
                        <option key={suffix} value={suffix}>
                          {suffix}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
              </FormSection>

              <FormSection
                icon={<MapPinIcon className="h-6 w-6 text-blue-500" />}
                title="Address"
              >
                <FormField label="Country" required>
                  <select
                    name="country"
                    value={formData.country || ""}
                    onChange={handleChange}
                    className={selectStyles("country")}
                  >
                    <option value="">Select your country</option>
                    {countries.map(({ code, name }) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <div className="grid grid-cols-1 gap-6">
                  <FormField label="Street Address" required>
                    <input
                      type="text"
                      name="street"
                      value={formData.street || ""}
                      onChange={handleChange}
                      className={inputStyles("street")}
                      placeholder="Enter your street address"
                    />
                  </FormField>

                  <FormField label="Additional Address">
                    <input
                      type="text"
                      name="additionalAddress"
                      value={formData.additionalAddress || ""}
                      onChange={handleChange}
                      className={inputStyles("additionalAddress")}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField label="City" required>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleChange}
                      className={inputStyles("city")}
                    />
                  </FormField>

                  <FormField label="State/Province" required>
                    <input
                      type="text"
                      name="province"
                      value={formData.province || ""}
                      onChange={handleChange}
                      className={inputStyles("province")}
                    />
                  </FormField>

                  <FormField label="Postal Code" required>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode || ""}
                      onChange={handleChange}
                      className={inputStyles("postalCode")}
                      maxLength="10"
                      inputMode="numeric"
                      pattern="\d*"
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection
                icon={<PhoneIcon className="h-6 w-6 text-blue-500" />}
                title="Contact Information"
              >
                <FormField label="Email Address" required>
                  <div className="relative">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className={`${inputStyles("email")} pl-10`}
                      placeholder="you@example.com"
                    />
                  </div>
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField label="Phone Type" required>
                    <select
                      name="phoneType"
                      value={formData.phoneType || ""}
                      onChange={handleChange}
                      className={selectStyles("phoneType")}
                    >
                      <option value="">Select type</option>
                      <option value="mobile">Mobile</option>
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                    </select>
                  </FormField>

                  <FormField label="Country Code" required>
                    <select
                      name="phoneCode"
                      value={formData.phoneCode || ""}
                      onChange={handleChange}
                      className={selectStyles("phoneCode")}
                    >
                      <option value="">Select code</option>
                      <option value="+1">+1 (US/Canada)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+63">+63 (Philippines)</option>
                    </select>
                  </FormField>

                  <FormField label="Phone Number" required>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleChange({
                          target: { name: "phoneNumber", value },
                        });
                      }}
                      className={inputStyles("phoneNumber")}
                      placeholder="Enter phone number"
                      maxLength="15"
                      inputMode="numeric"
                      pattern="\d*"
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection
                icon={<BriefcaseIcon className="h-6 w-6 text-blue-500" />}
                title="Work Experience"
                description="Tell us about your work history"
              >
                <div className="flex items-center mb-4">
                  <label className="flex items-center space-x-2 text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.noWorkExperience}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          noWorkExperience: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>I don't have any work experience</span>
                  </label>
                </div>

                {!formData.noWorkExperience && (
                  <div className="space-y-6">
                    {formData.workExperience.map((exp, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative group"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-800 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-sm font-semibold">
                              {index + 1}
                            </span>
                            Work Experience
                          </h3>
                          {formData.workExperience.length > 1 && (
                            <button
                              onClick={() => deleteWorkExperience(index)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={exp.jobTitle}
                              onChange={(e) =>
                                handleWorkExperienceChange(
                                  index,
                                  "jobTitle",
                                  e.target.value
                                )
                              }
                              className={inputStyles(
                                `workExperience.${index}.jobTitle`
                              )}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Company <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) =>
                                handleWorkExperienceChange(
                                  index,
                                  "company",
                                  e.target.value
                                )
                              }
                              className={inputStyles(
                                `workExperience.${index}.company`
                              )}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Location <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) =>
                                handleWorkExperienceChange(
                                  index,
                                  "location",
                                  e.target.value
                                )
                              }
                              className={inputStyles(
                                `workExperience.${index}.location`
                              )}
                              required
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={exp.currentWork}
                                onChange={(e) =>
                                  handleWorkExperienceChange(
                                    index,
                                    "currentWork",
                                    e.target.checked
                                  )
                                }
                                className="mr-2"
                              />
                              <span className="text-sm">
                                I currently work here
                              </span>
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              From Date <span className="text-red-500">*</span>
                            </label>
                            <DateMonthPicker
                              value={exp.fromDate}
                              onChange={(value) =>
                                handleWorkExperienceChange(
                                  index,
                                  "fromDate",
                                  value
                                )
                              }
                              placeholder="Select start date"
                              id={`work-from-${index}`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              To Date{" "}
                              {!exp.currentWork && (
                                <span className="text-red-500">*</span>
                              )}
                            </label>
                            <DateMonthPicker
                              value={exp.toDate}
                              onChange={(value) =>
                                handleWorkExperienceChange(
                                  index,
                                  "toDate",
                                  value
                                )
                              }
                              placeholder="Select end date"
                              id={`work-to-${index}`}
                              disabled={exp.currentWork}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Role Description{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={exp.description}
                              onChange={(e) =>
                                handleWorkExperienceChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={4}
                              className={inputStyles(
                                `workExperience.${index}.description`
                              )}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addWorkExperience}
                      className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <PlusCircleIcon className="h-5 w-5 mr-2" />
                      Add Work Experience
                    </button>
                  </div>
                )}
              </FormSection>

              <FormSection
                icon={<AcademicCapIcon className="h-6 w-6 text-blue-500" />}
                title="Education"
                description="Tell us about your educational background"
              >
                {formData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative group"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-sm font-semibold">
                          {index + 1}
                        </span>
                        Education
                      </h3>
                      {formData.education.length > 1 && (
                        <button
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              education: prev.education.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          School or University{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "school",
                              e.target.value
                            )
                          }
                          className={inputStyles(`education.${index}.school`)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Degree <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={edu.degree}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "degree",
                              e.target.value
                            )
                          }
                          className={selectStyles(`education.${index}.degree`)}
                          required
                        >
                          <option value="">Select Degree</option>
                          {degreeOptions.map((degree) => (
                            <option key={degree} value={degree}>
                              {degree}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Field of Study <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "fieldOfStudy",
                              e.target.value
                            )
                          }
                          className={inputStyles(
                            `education.${index}.fieldOfStudy`
                          )}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Overall Result (GPA)
                        </label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) =>
                            handleEducationChange(index, "gpa", e.target.value)
                          }
                          className={inputStyles(`education.${index}.gpa`)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          From Date <span className="text-red-500">*</span>
                        </label>
                        <DateMonthPicker
                          value={edu.fromYear}
                          onChange={(value) =>
                            handleEducationChange(index, "fromYear", value)
                          }
                          placeholder="Select start date"
                          id={`edu-from-${index}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          To Date (Actual or Expected){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <DateMonthPicker
                          value={edu.toYear}
                          onChange={(value) =>
                            handleEducationChange(index, "toYear", value)
                          }
                          placeholder="Select end date"
                          id={`edu-to-${index}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Add Education
                </button>
              </FormSection>

              <FormSection
                icon={<DocumentTextIcon className="h-6 w-6 text-blue-500" />}
                title="Skills"
                description="Add your professional skills (press Enter after each skill)"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full flex items-center group hover:bg-blue-100 transition-colors"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-400 hover:text-blue-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillsChange}
                    placeholder="Type a skill and press Enter"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </FormSection>

              <FormSection
                icon={<DocumentTextIcon className="h-6 w-6 text-blue-500" />}
                title="Resume/CV"
                description="Upload your resume (PDF format only)"
              >
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resume <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                        fieldErrors?.resume
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="space-y-2 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="resume-upload"
                            className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="resume-upload"
                              type="file"
                              accept=".pdf"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                setFormData((prev) => ({
                                  ...prev,
                                  resume: file,
                                }));
                                if (setFieldErrors) {
                                  setFieldErrors((prev) => ({
                                    ...prev,
                                    resume: undefined,
                                  }));
                                }
                              }}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF up to 5MB</p>
                        {(formData.resume || formData.resume_url) && (
                          <div className="mt-4 text-sm text-green-600 bg-green-50 py-2 px-4 rounded-md">
                            <p className="font-medium">Resume:</p>
                            <p className="mt-1">
                              {formData.resume
                                ? formData.resume.name
                                : "Previously uploaded resume"}
                            </p>
                            {formData.resume_url && (
                              <button
                                onClick={handleViewResume}
                                className="mt-2 text-blue-600 hover:text-blue-700 underline"
                              >
                                View Resume
                              </button>
                            )}
                          </div>
                        )}
                        {fieldErrors?.resume && (
                          <p className="mt-2 text-sm text-red-600">
                            {fieldErrors.resume}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </FormSection>
            </div>
          </div>
        </div>

        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
      </div>
    </>
  );
};

export default Profile;
