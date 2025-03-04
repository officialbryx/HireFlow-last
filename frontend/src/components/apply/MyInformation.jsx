import React from "react";
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

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

const FormSection = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center space-x-3 mb-6">
      {icon}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
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

const MyInformation = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const inputStyles =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";
  const selectStyles =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white appearance-none";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Please fill in all required fields marked with an asterisk (
              <span className="text-red-500">*</span>)
            </p>
          </div>
        </div>
      </div>

      {/* Previous Employment Section */}
      <FormSection
        icon={<UserCircleIcon className="h-6 w-6 text-blue-500" />}
        title="Previous Employment"
      >
        <FormField
          label={`Have you been previously employed by ${formData.company}?`}
          required
        >
          <div className="grid grid-cols-2 gap-4 mt-2">
            {["Yes", "No"].map((option) => (
              <label
                key={option}
                className="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none"
              >
                <input
                  type="radio"
                  name="previouslyEmployed"
                  value={option.toLowerCase()}
                  checked={formData.previouslyEmployed === option.toLowerCase()}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      {option}
                    </span>
                  </span>
                </span>
                <span
                  className={`border-2 absolute -inset-px rounded-lg pointer-events-none ${
                    formData.previouslyEmployed === option.toLowerCase()
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  aria-hidden="true"
                ></span>
              </label>
            ))}
          </div>
        </FormField>

        {formData.previouslyEmployed === "yes" && (
          <>
            <FormField label="Employee ID" required>
              <input
                type="text"
                name="employeeID"
                value={formData.employeeID}
                onChange={handleChange}
                className={inputStyles}
                placeholder="Enter your previous employee ID"
              />
            </FormField>

            <FormField label="Previous Manager" required>
              <input
                type="text"
                name="givenManager"
                value={formData.givenManager}
                onChange={handleChange}
                className={inputStyles}
                placeholder="Enter your previous manager's name"
              />
            </FormField>
          </>
        )}
      </FormSection>

      {/* Personal Information Section */}
      <FormSection
        icon={<UserCircleIcon className="h-6 w-6 text-blue-500" />}
        title="Personal Information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Given Name" required>
            <input
              type="text"
              name="givenName"
              value={formData.givenName}
              onChange={handleChange}
              className={inputStyles}
              placeholder="Enter your given name"
              required
            />
          </FormField>

          <FormField label="Middle Name">
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className={inputStyles}
              placeholder="Enter your middle name"
            />
          </FormField>

          <FormField label="Family Name" required>
            <input
              type="text"
              name="familyName"
              value={formData.familyName}
              onChange={handleChange}
              className={inputStyles}
              placeholder="Enter your family name"
              required
            />
          </FormField>

          <FormField label="Suffix">
            <select
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              className={selectStyles}
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

      {/* Address Section */}
      <FormSection
        icon={<MapPinIcon className="h-6 w-6 text-blue-500" />}
        title="Address"
      >
        <FormField label="Country" required>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={selectStyles}
            required
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
              value={formData.street}
              onChange={handleChange}
              className={inputStyles}
              placeholder="Enter your street address"
              required
            />
          </FormField>

          <FormField label="Additional Address">
            <input
              type="text"
              name="additionalAddress"
              value={formData.additionalAddress}
              onChange={handleChange}
              className={inputStyles}
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="City" required>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </FormField>

          <FormField label="State/Province" required>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </FormField>

          <FormField label="Postal Code" required>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </FormField>
        </div>
      </FormSection>

      {/* Contact Information Section */}
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
              value={formData.email}
              onChange={handleChange}
              className={`${inputStyles} pl-10`}
              placeholder="you@example.com"
              required
            />
          </div>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Phone Type" required>
            <select
              name="phoneType"
              value={formData.phoneType}
              onChange={handleChange}
              className={selectStyles}
              required
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
              value={formData.phoneCode}
              onChange={handleChange}
              className={selectStyles}
              required
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
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputStyles}
              placeholder="Enter phone number"
              required
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};

export default MyInformation;
