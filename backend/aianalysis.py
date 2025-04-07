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

def analyze_technical_details(job_post: str, resume_text: str) -> Dict[str, Any]:
    """
    Perform technical analysis to extract structured information from resume and job post.
    """
    try:
        # Initialize sections dictionary
        sections = {
            'personal_info': {
                'name': '',
                'email': '',
                'location': '',
                'phone': ''
            },
            'skills': {
                'hard_skills': {},
                'soft_skills': {},
                'missing_skills': []
            },
            'experience': {
                'years': 'Entry Level',
                'positions': [],
                'industries': []
            }
        }

        # Extract personal information directly from resume text
        if "Email Address:" in resume_text:
            sections['personal_info']['email'] = resume_text.split("Email Address:")[1].split("\n")[0].strip()
        if "Address:" in resume_text:
            sections['personal_info']['location'] = resume_text.split("Address:")[1].split("\n")[0].strip()
        if "Cellular No.:" in resume_text:
            sections['personal_info']['phone'] = resume_text.split("Cellular No.:")[1].split("\n")[0].strip()
        
        # Extract name (usually at the start of the resume)
        name_line = resume_text.split("\n")[0].strip()
        sections['personal_info']['name'] = name_line

        # Extract Hard Skills
        hard_skills = {}
        # Programming Languages
        if "Programming Languages:" in resume_text:
            prog_langs = resume_text.split("Programming Languages:")[1].split("\n")[0].strip()
            for lang in prog_langs.split(","):
                lang = lang.strip()
                if lang:
                    hard_skills[lang] = hard_skills.get(lang, 0) + 1

        # Frameworks & Libraries
        if "Frameworks & Libraries:" in resume_text:
            frameworks = resume_text.split("Frameworks & Libraries:")[1].split("\n")[0].strip()
            for framework in frameworks.split(","):
                framework = framework.strip()
                if framework:
                    hard_skills[framework] = hard_skills.get(framework, 0) + 1

        # Databases
        if "Databases:" in resume_text:
            databases = resume_text.split("Databases:")[1].split("\n")[0].strip()
            for db in databases.split(","):
                db = db.strip()
                if db:
                    hard_skills[db] = hard_skills.get(db, 0) + 1

        # Development skills
        if "Development:" in resume_text:
            dev_skills = resume_text.split("Development:")[1].split("\n")[0].strip()
            for skill in dev_skills.split(","):
                skill = skill.strip()
                if skill:
                    hard_skills[skill] = hard_skills.get(skill, 0) + 1

        sections['skills']['hard_skills'] = hard_skills

        # Extract Soft Skills
        soft_skills = {}
        if "OTHER SKILLS" in resume_text:
            other_skills_section = resume_text.split("OTHER SKILLS")[1].split("REFERENCES")[0]
            skill_lines = other_skills_section.split("\n")
            for line in skill_lines:
                line = line.strip()
                if line and not line.startswith("OTHER SKILLS"):
                    soft_skills[line] = 1

        sections['skills']['soft_skills'] = soft_skills

        # Compare with job requirements to find missing skills
        required_skills = []
        if "Skills Required:" in job_post:
            skills_section = job_post.split("Skills Required:")[1].split("\n")
            for line in skills_section:
                if line.strip().startswith("-"):
                    skill = line.strip("- ").strip()
                    required_skills.append(skill)

        # Find missing skills
        all_candidate_skills = set([k.lower() for k in hard_skills.keys()] + [k.lower() for k in soft_skills.keys()])
        missing_skills = [skill for skill in required_skills if skill.lower() not in all_candidate_skills]
        sections['skills']['missing_skills'] = missing_skills

        # Extract experience from projects
        if "DESIGN PROJECTS COMPLETED" in resume_text:
            projects_section = resume_text.split("DESIGN PROJECTS COMPLETED")[1].split("KNOWLEDGE")[0]
            projects = [line.strip() for line in projects_section.split("\n") if line.strip() and ":" in line]
            sections['experience']['positions'] = projects

        return sections

    except Exception as e:
        print(f"Error in technical analysis: {str(e)}")
        return {
            "error": str(e),
            "technical_analysis": "Technical analysis failed. Please try again later."
        }

def analyze_hr_with_ai(job_post: str, resume_text: str) -> Dict[str, Any]:
    """
    Perform HR analysis of resume against job post using only the raw text inputs.
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
        print(f"Error in HR analysis: {str(e)}")
        return {
            "error": str(e),
            "hr_analysis": "HR analysis failed. Please try again later.",
            "confidence_score": 0,
            "device_used": str(device)
        }

def analyze_with_ai(job_post: str, resume_text: str, analysis_results: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Perform AI analysis of resume against job post using only the raw text inputs.
    """
    try:
        # Get HR analysis results
        hr_results = analyze_hr_with_ai(job_post, resume_text)
        
        # Get technical analysis results
        technical_results = analyze_technical_details(job_post, resume_text)

        # Combine results
        return {
            **hr_results,
            "technical_analysis": technical_results
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
