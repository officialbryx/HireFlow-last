import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api/auth";

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
  const [touchedFields, setTouchedFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "password" || name === "confirmPassword") {
        const match =
          name === "password"
            ? value === newData.confirmPassword
            : newData.password === value;
        setPasswordsMatch(match);
      }

      return newData;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const validateField = (name, value) => {
    if (!touchedFields[name]) return true;
    if (name === "middleName") return true;
    return value.trim() !== "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouchedFields({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field].trim()
    );

    if (missingFields.length > 0) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await authApi.signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        userType: formData.userType,
      });
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

    if (fieldName === "confirmPassword" && formData.confirmPassword) {
      return `${baseClasses} ${
        passwordsMatch ? "border-green-500" : "border-red-500"
      }`;
    }

    if (fieldName === "middleName") {
      return `${baseClasses} border-gray-300`;
    }

    return `${baseClasses} ${
      !validateField(fieldName, formData[fieldName])
        ? "border-red-500"
        : "border-gray-300"
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
                {!validateField("firstName", formData.firstName) && (
                  <p className="mt-1 text-sm text-red-600">
                    First name is required
                  </p>
                )}
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
                {!validateField("lastName", formData.lastName) && (
                  <p className="mt-1 text-sm text-red-600">
                    Last name is required
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address *
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
              />
              {!validateField("email", formData.email) && (
                <p className="mt-1 text-sm text-red-600">Email is required</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password (6 or more characters)
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                minLength={6}
                className={getInputClassName("password")}
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.password}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                required
                minLength={6}
                className={getInputClassName("confirmPassword")}
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.confirmPassword}
              />
              {formData.confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-sm text-red-600">
                  Passwords do not match
                </p>
              )}
              {formData.confirmPassword && passwordsMatch && (
                <p className="mt-1 text-sm text-green-600">Passwords match</p>
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
