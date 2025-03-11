import api from "../api";

export const analyzeResume = async (
  resumeUrl,
  jobDescription,
  requiredSkills
) => {
  try {
    const response = await api.post("/api/analyze-resume", {
      resume_url: resumeUrl,
      job_description: jobDescription,
      required_skills: requiredSkills,
    });

    return response.data.analysis;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};
