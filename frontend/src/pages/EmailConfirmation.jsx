import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const EmailConfirmation = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        if (user?.confirmed_at) {
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="/hireflow-logo.ico"
          alt="HireFlow"
        />
        {error ? (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-red-600">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => navigate("/signup")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Sign Up
            </button>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-green-600">
              Email Verified Successfully!
            </h2>
            <p className="mt-2 text-gray-600">
              Your email has been verified. You will be redirected to the login
              page in a few seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation;
