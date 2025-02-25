const API_BASE_URL = "http://localhost:5000/api";

export const api = {
  // Login API
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Signup API
  async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Signup failed");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  // Create a New Job Posting
  async createJobPosting(jobData) {
    try {
      console.log("Sending job data:", jobData); // Debugging request payload

      const response = await fetch(`${API_BASE_URL}/job-postings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error response from server:", error); // Debugging response errors
        throw new Error(error.error || "Failed to create job posting");
      }

      const job = await response.json();
      console.log("Job created successfully:", job); // Debugging job creation success
      const jobId = job.job_id;
      console.log(jobId);

      // Add Responsibilities
      console.log("Adding responsibilities:", jobData.responsibilities);
      await fetch(`${API_BASE_URL}/job-postings/${jobId}/responsibilities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responsibilities: jobData.responsibilities }),
      });
      console.log("Responsibilities added successfully");

      // Add Qualifications
      console.log("Adding qualifications:", jobData.qualifications);
      await fetch(`${API_BASE_URL}/job-postings/${jobId}/qualifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qualifications: jobData.qualifications }),
      });
      console.log("Qualifications added successfully");

      // Add Skills
      console.log("Adding skills:", jobData.skills);
      await fetch(`${API_BASE_URL}/job-postings/${jobId}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: jobData.skills }),
      });
      console.log("Skills added successfully");

      return job;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  },
};
