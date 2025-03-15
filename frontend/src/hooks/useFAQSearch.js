import { useState, useMemo, useEffect } from 'react';

export function useFAQSearch(faqSections, setActiveSection, setActiveQuestions) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sections and questions based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return faqSections;

    const lowerQuery = searchQuery.toLowerCase().trim();
    
    return faqSections.map(section => {
      const filteredQuestions = section.questions.filter(
        question => 
          question.q.toLowerCase().includes(lowerQuery) || 
          question.a.toLowerCase().includes(lowerQuery)
      );
      
      return {
        ...section,
        questions: filteredQuestions,
        hasMatches: filteredQuestions.length > 0
      };
    }).filter(section => section.hasMatches);
  }, [searchQuery, faqSections]);
  
  // Auto-expand sections with search results
  useEffect(() => {
    if (searchQuery && filteredSections.length > 0) {
      // Expand first section with matches
      setActiveSection(0);
      
      // Expand all questions with matches in that section
      const newActiveQuestions = {};
      filteredSections[0].questions.forEach((_, index) => {
        newActiveQuestions[`0-${index}`] = true;
      });
      setActiveQuestions(newActiveQuestions);
    }
  }, [searchQuery, filteredSections, setActiveSection, setActiveQuestions]);

  // Create text segments for highlighting (no JSX here)
  const getTextSegments = (text) => {
    if (!searchQuery.trim()) return [{ text, isMatch: false }];
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map(part => ({
      text: part,
      isMatch: part.toLowerCase() === searchQuery.toLowerCase()
    }));
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredSections,
    getTextSegments
  };
}