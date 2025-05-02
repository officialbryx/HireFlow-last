import { supabase } from "../supabaseClient";

export const evaluationApi = {
  saveEvaluationResults: async (applicationId, results) => {
    try {
      const { data, error } = await supabase
        .from('evaluation_results')
        .upsert({
          application_id: applicationId,
          overall_match: results.ai_insights.match_scores.overall_match,
          skills_match: results.ai_insights.match_scores.skills_match,
          experience_score: results.ai_insights.match_scores.experience_match || 0,
          education_score: results.ai_insights.match_scores.education_match || 0,
          qualified: results.ai_insights.match_scores.qualified,
          ai_insights: results.ai_insights,
          technical_analysis: results.technical_analysis
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving evaluation results:', error);
      throw error;
    }
  },

  getEvaluationResult: async (applicationId) => {
    try {
      const { data, error } = await supabase
        .from('evaluation_results')
        .select('*')
        .eq('application_id', applicationId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching evaluation result:', error);
      throw error;
    }
  }
};