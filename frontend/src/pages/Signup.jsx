import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";
import { validatePassword } from "../utils/passwordValidation";

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
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClasses =
      "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500";

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="/hireflow-logo.ico"
          alt="HireFlow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Make the most of your professional life
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name *
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
                />
              </div>
              <div>
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium text-gray-700"
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
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name *
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
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password *
              </label>
              <div className="mt-1 relative">
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
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {(isSubmitted || formData.password) && (
                <div className="mt-2 text-sm">
                  <p className="font-medium text-gray-700">
                    Password must have:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {passwordValidation.requirements.map((req) => (
                      <li
                        key={req.id}
                        className={
                          req.isMet ? "text-green-600" : "text-red-600"
                        }
                      >
                        {req.message}
                      </li>
                    ))}
                  </ul>
                  {passwordValidation.isCommonPassword && (
                    <p className="text-red-600 mt-1">
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
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password *
              </label>
              <div className="mt-1 relative">
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
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && !passwordsMatch && (
                <p className="text-red-500 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="userType"
                className="block text-sm font-medium text-gray-700"
              >
                I want to
              </label>
              <select
                name="userType"
                id="userType"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={handleChange}
              >
                <option value="jobseeker">Find a job</option>
                <option value="employer">Hire talent</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? "Creating account..." : "Agree & Join"}
              </button>
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
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
