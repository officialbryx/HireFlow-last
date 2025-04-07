import torch
from openai import OpenAI
from typing import Dict, Any
import re

# Configure GPU settings
if torch.cuda.is_available():
    torch.cuda.set_device(0)  # Use first GPU
    device = torch.device("cuda")
else:
    device = torch.device("cpu")
print(f"Using device: {device}")

# Configure DeepSeek client
client = OpenAI(
    api_key="sk-3c492431b34d413db1e3f4f2f126b0e4",  
    base_url="https://api.deepseek.com/v1"  
)

def analyze_with_ai(job_post: str, resume_text: str, analysis_results: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Perform AI analysis of resume against job post using only the raw text inputs.
    """
    try:
        prompt = f"""
        Analyze this job application from an HR perspective and provide percentage scores for the match:

        JOB DESCRIPTION:
        {job_post}

        CANDIDATE RESUME:
        {resume_text}

        Please provide a plain text analysis with the following sections, including explicit percentage scores:

        1. CANDIDATE OVERVIEW
        Write a simple summary of the candidate's profile.
        Include their key qualifications without bullet points.
        List any concerns in plain text.

        2. SKILLS ANALYSIS
        Provide a skills match percentage (e.g., "Skills Match: 75%").
        List the matching skills in plain text.
        Note missing critical skills.
        Describe skill development potential.

        3. QUALIFICATION ASSESSMENT
        Provide an overall match percentage (e.g., "Overall Match: 80%").
        Describe education background.
        Explain experience level.
        State if the candidate is qualified or unqualified for the role.

        4. HIRING RECOMMENDATIONS
        List interview topics.
        Describe role fit.
        Note compensation factors.
        List risks plainly.

        5. DEVELOPMENT OPPORTUNITIES
        List training needs.
        Note growth areas.
        Describe career alignment.

        Use only plain text with numbers for sections. Provide explicit percentage scores in the Skills Analysis and Qualification Assessment sections.
        """

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500,
            stream=False
        )

        # Process the response to extract match scores
        content = response.choices[0].message.content.lower()
        
        # Get qualification assessment section and determine qualified status
        qual_section = content.split("3. qualification assessment")[1].split("4.")[0].lower()
        qualified = "qualified" in qual_section and "not qualified" not in qual_section and "unqualified" not in qual_section
        
        # Extract match scores
        overall_match = 0
        skills_match = 0
        match_patterns = [
            r'(\d+)%?\s*(?:match|fit|compatibility)',
            r'(?:match|fit|compatibility).*?(\d+)%',
            r'overall.*?(\d+)%'
        ]
        
        # First try to extract overall match from qualification assessment section
        for pattern in match_patterns:
            matches = re.findall(pattern, qual_section)
            if matches:
                try:
                    overall_match = min(100, int(matches[0]))
                    break
                except ValueError:
                    continue

        # If no overall match found in qualification section, use default based on qualification
        if overall_match == 0:
            overall_match = 75 if qualified else 65

        # Extract skills match from skills analysis section
        skills_section = content.split("2. skills analysis")[1].split("3.")[0].lower()
        for pattern in match_patterns:
            matches = re.findall(pattern, skills_section)
            if matches:
                try:
                    skills_match = min(100, int(matches[0]))
                    break
                except ValueError:
                    continue

        # If no explicit skills match found, use overall match as fallback
        if skills_match == 0:
            skills_match = overall_match

        return {
            "sections": {
                "candidate_overview": {
                    "title": "Candidate Overview",
                    "content": response.choices[0].message.content.split("2. SKILLS ANALYSIS")[0].replace("1. CANDIDATE OVERVIEW", "").strip()
                },
                "skills_analysis": {
                    "title": "Skills Analysis",
                    "content": response.choices[0].message.content.split("2. SKILLS ANALYSIS")[1].split("3. QUALIFICATION ASSESSMENT")[0].strip()
                },
                "qualification_assessment": {
                    "title": "Qualification Assessment",
                    "content": response.choices[0].message.content.split("3. QUALIFICATION ASSESSMENT")[1].split("4. HIRING RECOMMENDATIONS")[0].strip()
                },
                "hiring_recommendations": {
                    "title": "Hiring Recommendations",
                    "content": response.choices[0].message.content.split("4. HIRING RECOMMENDATIONS")[1].split("5. DEVELOPMENT OPPORTUNITIES")[0].strip()
                },
                "development_opportunities": {
                    "title": "Development Opportunities",
                    "content": response.choices[0].message.content.split("5. DEVELOPMENT OPPORTUNITIES")[1].strip()
                }
            },
            "match_scores": {
                "overall_match": overall_match,
                "skills_match": skills_match,
                "qualified": qualified
            },
            "confidence_score": response.choices[0].finish_reason == "stop",
            "analysis_timestamp": response.created,
            "model_version": response.model,
            "device_used": str(device)
        }

    except Exception as e:
        print(f"Error in AI analysis: {str(e)}")
        return {
            "error": str(e),
            "hr_analysis": "AI analysis failed. Please try again later.",
            "confidence_score": 0,
            "device_used": str(device)
        }

if __name__ == "__main__":
    print("This module should be imported and used with the main application.")
