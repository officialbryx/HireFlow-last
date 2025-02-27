import axios from "axios";
import { supabase } from "./supabaseClient";

export const analyzeResume = async (resumeUrl, jobDetails) => {
  try {
    // Download the PDF file from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("resumes")
      .download(resumeUrl.split("/").pop());

    if (downloadError) throw downloadError;

    // Create form data with both resume and job requirements
    const formData = new FormData();
    formData.append("resume", fileData);
    formData.append("job_requirements", JSON.stringify(jobDetails));

    // Send to backend for analysis
    const response = await axios.post(
      "http://localhost:5000/api/analyze-resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.analysis;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};
