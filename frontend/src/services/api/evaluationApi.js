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
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (error) {
        // Handle specific Supabase errors
        if (error.code === 'PGRST116') {
          // No results found - return null instead of throwing
          return null;
        }
        throw error;
      }

      // If no data but also no error, return null
      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching evaluation result:', error);
      // Return null instead of throwing for not found cases
      if (error.status === 406 || error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
  }
};