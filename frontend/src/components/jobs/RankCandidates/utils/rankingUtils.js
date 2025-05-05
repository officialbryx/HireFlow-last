export const getQualityIndicator = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-green-500";
    if (score >= 70) return "bg-gradient-to-r from-green-500 to-teal-500";
    if (score >= 60) return "bg-gradient-to-r from-yellow-400 to-amber-500";
    return "bg-gradient-to-r from-orange-400 to-red-500";
  };
  
  export const sortCandidatesByRankingCriteria = (candidatesList, criteria) => {
    return [...candidatesList]
      .sort((a, b) => {
        switch (criteria) {
          case "overall":
            return b.matchScore - a.matchScore;
          case "skills":
            return b.skillMatch - a.skillMatch;
          case "experience":
            return b.experienceScore - a.experienceScore;
          case "education":
            return b.educationScore - a.educationScore;
          default:
            return b.matchScore - a.matchScore;
        }
      })
      .map((candidate, index) => ({
        ...candidate,
        rank: index + 1,
      }));
  };