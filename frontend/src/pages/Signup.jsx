import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";
import { validatePassword } from "../utils/passwordValidation";
import SignupModal from "../components/SignupModal";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "jobseeker",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    requirements: [],
    meetsComplexityRequirement: false,
    isCommonPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleBlur = (e) => {
    if (isSubmitted) {
      setTouched((prev) => ({
        ...prev,
        [e.target.name]: true,
      }));
    }
  };

  useEffect(() => {
    // Only set passwords as matching if both fields have values and they match
    setPasswordsMatch(
      formData.password !== "" &&
        formData.confirmPassword !== "" &&
        formData.password === formData.confirmPassword
    );
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Mark all required fields as touched on submit
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Check if any required fields are empty
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Please meet all password requirements");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const submitData = { ...formData };
      delete submitData.confirmPassword;
      await api.signup(submitData);
      setModalStatus("success");
      setModalMessage(
        `Your account has been created! Please check your email for a confirmation message to complete the setup. If you don't see it in your inbox, check your spam or junk folder.`
      );
      setShowModal(true);
    } catch (err) {
      setModalStatus("error");
      setModalMessage(
        err.message || "An error occurred during signup. Please try again."
      );
      setShowModal(true);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClasses =
      "mt-1 block w-full border rounded-lg shadow-sm py-3 px-4 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out";

    if (fieldName === "middleName") return `${baseClasses} border-gray-300`;

    if (!isSubmitted && !touched[fieldName])
      return `${baseClasses} border-gray-300`;

    if (fieldName === "confirmPassword" || fieldName === "password") {
      if (!formData[fieldName]) return `${baseClasses} border-red-500`;
      return `${baseClasses} ${
        passwordsMatch ? "border-green-500" : "border-red-500"
      }`;
    }

    return `${baseClasses} ${
      formData[fieldName] ? "border-green-500" : "border-red-500"
    }`;
  };

  const RequiredIndicator = () => <span className="text-red-500 ml-1">*</span>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="h-16 w-auto"
            src="/hireflow-logo.ico"
            alt="HireFlow"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Make the most of your professional life
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
          Join HireFlow to connect with opportunities and advance your career
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First name
                  <RequiredIndicator />
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  className={getInputClassName("firstName")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData.firstName}
                  placeholder="Bryan"
                />
              </div>
              <div>
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Middle name
                </label>
                <input
                  type="text"
                  name="middleName"
                  id="middleName"
                  className={getInputClassName("middleName")}
                  onChange={handleChange}
                  value={formData.middleName}
                  placeholder="Apostol"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last name
                  <RequiredIndicator />
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  className={getInputClassName("lastName")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData.lastName}
                  placeholder="Tiamzon"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
                <RequiredIndicator />
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className={getInputClassName("email")}
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.email}
                placeholder="bryan.tiamzon@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
                <RequiredIndicator />
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  minLength={12}
                  className={getInputClassName("password")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData.password}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {(isSubmitted || formData.password) && (
                <div className="mt-2 text-sm bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-1">
                    Password must have:
                  </p>
                  <ul className="space-y-1">
                    {passwordValidation.requirements.map((req) => (
                      <li
                        key={req.id}
                        className={`flex items-center ${
                          req.isMet ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {req.isMet ? (
                          <svg
                            className="h-4 w-4 mr-1.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-4 w-4 mr-1.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {req.message}
                      </li>
                    ))}
                  </ul>
                  {passwordValidation.isCommonPassword && (
                    <p className="text-red-600 mt-2 flex items-center">
                      <svg
                        className="h-4 w-4 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      This password is too common. Please choose a more unique
                      password.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
                <RequiredIndicator />
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  minLength={12}
                  className={getInputClassName("confirmPassword")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData.confirmPassword}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && !passwordsMatch && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Passwords do not match
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="userType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                I want to
              </label>
              <div className="relative">
                <select
                  name="userType"
                  id="userType"
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 bg-white text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  onChange={handleChange}
                  value={formData.userType}
                >
                  <option value="jobseeker">Find a job</option>
                  <option value="employer">Hire talent</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Agree & Join"
                )}
              </button>
            </div>

            <div className="text-xs text-center text-gray-500 mt-2">
              By clicking "Agree & Join", you agree to HireFlow's
              <br />
              <a href="/terms" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </a>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already on HireFlow?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SignupModal
        isOpen={showModal}
        status={modalStatus}
        message={modalMessage}
        onClose={() => {
          setShowModal(false);
          if (modalStatus === "success") {
            navigate("/login");
          }
        }}
      />
    </div>
  );
};

export default Signup;
