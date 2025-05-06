import { supabase } from "../supabaseClient";

export const evaluationApi = {
  saveEvaluationResults: async (applicationId, results) => {
    try {
      const { data, error } = await supabase.from("evaluation_results").upsert({
        application_id: applicationId,
        overall_match: results.ai_insights.match_scores.overall_match,
        skills_match: results.ai_insights.match_scores.skills_match,
        experience_score:
          results.ai_insights.match_scores.experience_match || 0,
        education_score: results.ai_insights.match_scores.education_match || 0,
        qualified: results.ai_insights.match_scores.qualified,
        ai_insights: results.ai_insights,
        technical_analysis: results.technical_analysis,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving evaluation results:", error);
      throw error;
    }
  },

  getEvaluationResult: async (applicationId) => {
    try {
      const { data, error } = await supabase
        .from("evaluation_results")
        .select("*")
        .eq("application_id", applicationId)
        .maybeSingle();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error("Error fetching evaluation result:", error);
      if (error.status === 406 || error.code === "PGRST116") return null;
      throw error;
    }
  },

  saveBatchEvaluationResults: async (evaluations) => {
    try {
      const formattedEvaluations = evaluations.map((evaluation) => ({
        application_id: evaluation.applicationId,
        overall_match:
          evaluation.results.ai_insights.match_scores.overall_match,
        skills_match: evaluation.results.ai_insights.match_scores.skills_match,
        experience_score:
          evaluation.results.ai_insights.match_scores.experience_match || 0,
        education_score:
          evaluation.results.ai_insights.match_scores.education_match || 0,
        qualified: evaluation.results.ai_insights.match_scores.qualified,
        ai_insights: evaluation.results.ai_insights,
        technical_analysis: evaluation.results.technical_analysis,
      }));

      const { data, error } = await supabase
        .from("evaluation_results")
        .upsert(formattedEvaluations);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving batch evaluation results:", error);
      throw error;
    }
  },

  getBatchEvaluationResults: async (applicationIds) => {
    try {
      const { data, error } = await supabase
        .from("evaluation_results")
        .select("*")
        .in("application_id", applicationIds);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching batch evaluation results:", error);
      throw error;
    }
  },
};
