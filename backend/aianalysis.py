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
    base_url="https://api.deepseek.com/v1",
    api_key="sk-3c492431b34d413db1e3f4f2f126b0e4"
)

def analyze_technical_details(job_post: str, resume_text: str) -> Dict[str, Any]:
    try:
        technical_prompt = f"""
        Analyze the resume and job post to extract key information and provide a structured response. Return ONLY the sections below with NO additional text:

        1. PERSONAL INFORMATION
        Name: [Extract full name]
        Email: [Extract email]
        Phone: [Extract phone]
        Location: [Extract location]

        2. EDUCATION
        Highest Degree: [Extract or write Not specified]
        Field of Study: [Extract or write Not specified]
        Institution: [Extract name]
        Graduation Year: [Extract or write Not specified]
        Academic Achievements:
        • [List each achievement]
        Certifications:
        • [List each certification]
        Relevant Coursework:
        • [List relevant courses]

        3. PROFESSIONAL EXPERIENCE
        Years of Experience: [State total years or status]
        Current Position: [State current role or status]
        Key Projects:
        • [Project name and description]
        Industries: [List relevant industries]
        Achievements:
        • [List key achievements]

        4. SKILLS
        Technical Skills:
        • [List each technical skill for any job category]
        Soft Skills:
        • [List each soft skill]

        5. JOB MATCH ANALYSIS
        Required Skills Match:
        • [List each required skill from the job post content and state if present]
        Experience Match: [Analyze experience fit]
        Education Match: [Analyze education fit]

        RESUME TEXT:
        {resume_text}

        JOB POST:
        {job_post}

        Analyze the above and provide ONLY the structured sections. Use bullet points (•) for lists.
        Write "Not specified" for missing information.
        Do not include any additional text or explanations.
        Do not use any markdown formatting or special characters except bullet points (•).
        """

        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": technical_prompt}],
            temperature=0.7,
            max_tokens=1500
        )

        content = response.choices[0].message.content

        # Parse the response into structured sections
        technical_analysis = {
            'personal_info': {},
            'education': {},
            'experience': {},
            'skills': {},
            'job_match': {}
        }

        current_section = None
        current_data = {}
        lines = content.split('\n')

        for line in lines:
            line = line.strip()
            if not line:
                continue

            if line.startswith('1. PERSONAL INFORMATION'):
                current_section = 'personal_info'
            elif line.startswith('2. EDUCATION'):
                if current_data:
                    technical_analysis[current_section] = current_data
                current_section = 'education'
                current_data = {}
            elif line.startswith('3. PROFESSIONAL EXPERIENCE'):
                if current_data:
                    technical_analysis[current_section] = current_data
                current_section = 'experience'
                current_data = {}
            elif line.startswith('4. SKILLS'):
                if current_data:
                    technical_analysis[current_section] = current_data
                current_section = 'skills'
                current_data = {}
            elif line.startswith('5. JOB MATCH'):
                if current_data:
                    technical_analysis[current_section] = current_data
                current_section = 'job_match'
                current_data = {}
            elif current_section and ':' in line:
                key, value = [x.strip() for x in line.split(':', 1)]
                if value:
                    current_data[key.lower().replace(' ', '_')] = value
                else:
                    current_data[key.lower().replace(' ', '_')] = []
            elif current_section and line.startswith('•'):
                item = line[1:].strip()
                last_key = list(current_data.keys())[-1] if current_data else None
                if last_key and isinstance(current_data[last_key], list):
                    current_data[last_key].append(item)

        # Add the last section
        if current_data:
            technical_analysis[current_section] = current_data

        return technical_analysis

    except Exception as e:
        print(f"Error in technical analysis: {str(e)}")
        return {}

def parse_section_content(content_lines):
    """Helper function to parse section content into structured data"""
    result = {}
    current_section = None
    current_items = []

    for line in content_lines:  # Using content_lines parameter directly
        line = line.strip()
        if not line:
            continue

        # Handle bullet points and lists
        if line.startswith('•'):
            item = line[1:].strip()
            if current_section:
                if current_section not in result:
                    result[current_section] = []
                result[current_section].append(item)
            else:
                if 'items' not in result:
                    result['items'] = []
                result['items'].append(item)
            continue

        # Handle section headers and key-value pairs
        if ':' in line:
            key, value = [part.strip() for part in line.split(':', 1)]
            key = key.lower().replace(' ', '_')

            # Check if this is a list section
            if not value or value.isspace():
                current_section = key
                if current_section not in result:
                    result[current_section] = []
            else:
                # Handle regular key-value pairs
                current_section = None
                if value.lower() != 'not specified':
                    result[key] = value

    return result

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
