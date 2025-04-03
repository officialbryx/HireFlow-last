import { supabase } from '../../../services/supabaseClient';

export const getPublicUrl = (resumeUrl) => {
  if (!resumeUrl) return null;
  try {
    const filename = resumeUrl.split("/").pop();
    const filePath = `applications/${filename}`;
    const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Error generating URL:", error);
    return null;
  }
};

// Update getBadgeColor in utils/index.js
export const getBadgeColor = (status) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-800";
      case "accepted": return "bg-emerald-100 text-emerald-800";
      case "rejected": return "bg-rose-100 text-rose-800";
      case "interview": return "bg-blue-100 text-blue-800"; // Added missing status
      default: return "bg-gray-100 text-gray-800";
    }
  };

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};