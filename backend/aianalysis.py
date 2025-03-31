import torch
from openai import OpenAI
from typing import Dict, Any

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

def analyze_with_ai(job_post: str, resume_text: str, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
    """
    Perform comprehensive AI analysis of resume against job post's requirements and qualifications.
    """
    try:
        # Create structured prompt for HR-focused analysis
        prompt = f"""
        Analyze this job application from an HR perspective:

        JOB DESCRIPTION:
        {job_post[:500]}...

        CANDIDATE PROFILE:
        Personal Information:
        Name: {analysis_results['resume_analysis']['personal_info'].get('name', 'Not provided')}
        Email: {analysis_results['resume_analysis']['personal_info'].get('email', 'Not provided')}
        Location: {analysis_results['resume_analysis']['personal_info'].get('location', 'Not provided')}

        Skills Assessment:
        Hard Skills Present: {', '.join(analysis_results['resume_analysis']['skills']['hard_skills'].keys())}
        Soft Skills Present: {', '.join(analysis_results['resume_analysis']['skills']['soft_skills'].keys())}
        Missing Critical Skills: {', '.join(analysis_results['comparison']['skill_match']['missing'])}
        Skills Match Rate: {analysis_results['comparison']['skill_match']['match_percentage']}%

        Education:
        Level: {', '.join(analysis_results['resume_analysis']['education']['levels']) if analysis_results['resume_analysis']['education']['levels'] else 'Not specified'}
        Requirements Met: {'Yes' if analysis_results['comparison']['education_match']['sufficient'] else 'No'}

        Experience:
        Years: {analysis_results['resume_analysis']['experience']['years']}
        Recent Positions: {', '.join(analysis_results['resume_analysis']['experience']['positions'][:2]) if analysis_results['resume_analysis']['experience']['positions'] else 'Not specified'}
        Requirements Met: {'Yes' if analysis_results['comparison']['experience_match']['sufficient'] else 'No'}

        Overall Match Score: {analysis_results['comparison']['overall_match']['score']}%

        Please provide a plain text analysis with the following sections. Do not use any special characters, formatting, or bullet points:

        1. CANDIDATE OVERVIEW
        Write a simple summary of the candidate's profile.
        Include their key qualifications without bullet points.
        List any concerns in plain text.

        2. SKILLS ANALYSIS
        List the matching skills in plain text.
        Note missing critical skills.
        Describe skill development potential.

        3. QUALIFICATION ASSESSMENT
        Describe education background.
        Explain experience level.
        State overall qualification fit.

        4. HIRING RECOMMENDATIONS
        List interview topics.
        Describe role fit.
        Note compensation factors.
        List risks plainly.

        5. DEVELOPMENT OPPORTUNITIES
        List training needs.
        Note growth areas.
        Describe career alignment.

        Use only plain text with numbers for sections. Avoid any special characters or formatting.
        """

        # Generate HR-focused analysis
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500,
            stream=False
        )

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
            "candidate_profile": {
                "personal_info": analysis_results['resume_analysis']['personal_info'],
                "skills_assessment": {
                    "present_skills": {
                        "hard": list(analysis_results['resume_analysis']['skills']['hard_skills'].keys()),
                        "soft": list(analysis_results['resume_analysis']['skills']['soft_skills'].keys())
                    },
                    "missing_skills": analysis_results['comparison']['skill_match']['missing'],
                    "match_rate": analysis_results['comparison']['skill_match']['match_percentage']
                },
                "education": {
                    "levels": analysis_results['resume_analysis']['education']['levels'],
                    "meets_requirements": analysis_results['comparison']['education_match']['sufficient']
                },
                "experience": {
                    "years": analysis_results['resume_analysis']['experience']['years'],
                    "recent_positions": analysis_results['resume_analysis']['experience']['positions'][:2],
                    "meets_requirements": analysis_results['comparison']['experience_match']['sufficient']
                }
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
