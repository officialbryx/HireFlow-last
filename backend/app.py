from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from transformers import AutoTokenizer, AutoModelForMaskedLM, pipeline
import logging
import fitz  # PyMuPDF for PDF processing
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Connect to MySQL Database (only for non-auth related data)
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="admin",
    database="hireflow"
)
cursor = db.cursor()

# Initialize JobBERT
tokenizer = AutoTokenizer.from_pretrained("jjzha/jobbert-base-cased")
model = AutoModelForMaskedLM.from_pretrained("jjzha/jobbert-base-cased")
pipe = pipeline("fill-mask", model="jjzha/jobbert-base-cased")

def extract_text_from_pdf(pdf_file):
    text = ""
    try:
        # Open PDF file
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        
        # Extract text from each page
        for page in doc:
            text += page.get_text()
        
        return text
    except Exception as e:
        logging.error(f"Error extracting text from PDF: {str(e)}")
        return None

def analyze_resume_against_job(resume_text, job_requirements):
    try:
        # Initialize TF-IDF vectorizer
        vectorizer = TfidfVectorizer(stop_words='english')
        
        # Analyze text similarity
        documents = [resume_text, job_requirements]
        tfidf_matrix = vectorizer.fit_transform(documents)
        similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

        # Extract key components
        skills_match = extract_skills_match(resume_text, job_requirements)
        experience_match = extract_experience_match(resume_text, job_requirements)
        education_match = extract_education_match(resume_text, job_requirements)

        # Calculate overall match
        overall_match = (similarity_score + skills_match + experience_match + education_match) / 4

        analysis_result = {
            "scan_accuracy": check_pdf_scan_quality(resume_text),
            "similarity_score": float(similarity_score),
            "skills_match": float(skills_match),
            "experience_match": float(experience_match),
            "education_match": float(education_match),
            "overall_match": float(overall_match),
            "qualified": overall_match >= 0.7,
            "confidence_score": calculate_confidence_score(resume_text),
            "detailed_analysis": {
                "missing_requirements": find_missing_requirements(resume_text, job_requirements),
                "matching_skills": find_matching_skills(resume_text, job_requirements),
                "suggested_improvements": generate_suggestions(resume_text, job_requirements)
            }
        }

        print("\n=== RESUME ANALYSIS RESULTS ===")
        print(f"PDF Scan Accuracy: {analysis_result['scan_accuracy']:.2%}")
        print(f"Overall Match Score: {analysis_result['overall_match']:.2%}")
        print(f"Qualification Status: {'QUALIFIED' if analysis_result['qualified'] else 'NOT QUALIFIED'}")
        print("\nDetailed Scores:")
        print(f"- Skills Match: {analysis_result['skills_match']:.2%}")
        print(f"- Experience Match: {analysis_result['experience_match']:.2%}")
        print(f"- Education Match: {analysis_result['education_match']:.2%}")
        print("\nConfidence Score: {analysis_result['confidence_score']:.2%}")
        print("\nKey Findings:")
        for finding in analysis_result['detailed_analysis']['missing_requirements']:
            print(f"- {finding}")
        
        return analysis_result

    except Exception as e:
        print(f"Error in resume analysis: {str(e)}")
        return None

def check_pdf_scan_quality(text):
    # Check for common OCR issues and text extraction quality
    if not text:
        return 0.0
    
    words = text.split()
    recognizable_words = sum(1 for word in words if len(word) > 1 and word.isalnum())
    scan_quality = min(recognizable_words / len(words) if words else 0, 1.0)
    return scan_quality

def calculate_confidence_score(text):
    # Estimate confidence based on text quality and recognition
    if not text:
        return 0.0
    
    # Check for common indicators of good quality text
    has_sections = any(header in text.lower() for header in ['experience', 'education', 'skills'])
    has_formatting = '\n' in text and len(text.split('\n')) > 5
    has_content = len(text.split()) > 100
    
    confidence = (has_sections + has_formatting + has_content) / 3
    return confidence

def extract_skills_match(resume_text, job_requirements):
    """Extract and compare skills from resume and job requirements"""
    # Common technical skills to look for
    common_skills = [
        'python', 'javascript', 'java', 'c++', 'sql', 'nosql', 'aws', 
        'react', 'node', 'api', 'etl', 'git', 'docker', 'kubernetes',
        'machine learning', 'data science', 'backend', 'frontend'
    ]
    
    resume_lower = resume_text.lower()
    requirements_lower = job_requirements.lower()
    
    # Find skills mentioned in both texts
    skills_in_resume = set(skill for skill in common_skills if skill in resume_lower)
    skills_in_job = set(skill for skill in common_skills if skill in requirements_lower)
    
    if not skills_in_job:
        return 0.5  # Default score if no skills mentioned in requirements
    
    # Calculate match percentage
    matching_skills = skills_in_resume.intersection(skills_in_job)
    match_score = len(matching_skills) / len(skills_in_job)
    
    return min(match_score, 1.0)  # Cap at 1.0

def extract_experience_match(resume_text, job_requirements):
    """Analyze experience requirements match"""
    resume_lower = resume_text.lower()
    requirements_lower = job_requirements.lower()
    
    # Look for years of experience
    exp_patterns = [
        r'(\d+)[\+]?\s*(?:years?|yrs?)',
        r'(\d+)[\+]?\s*years? experience',
        r'experience:\s*(\d+)[\+]?\s*years?'
    ]
    
    resume_years = 0
    req_years = 0
    
    # Extract years from resume
    for pattern in exp_patterns:
        matches = re.findall(pattern, resume_lower)
        if matches:
            resume_years = max([int(y) for y in matches])
            break
    
    # Extract years from requirements
    for pattern in exp_patterns:
        matches = re.findall(pattern, requirements_lower)
        if matches:
            req_years = max([int(y) for y in matches])
            break
    
    if req_years == 0:
        return 0.7  # Default score if no specific years mentioned
    
    # Calculate match percentage
    match_score = min(resume_years / req_years, 1.0) if req_years > 0 else 0.5
    return match_score

def extract_education_match(resume_text, job_requirements):
    """Analyze education requirements match"""
    education_levels = {
        'phd': 4,
        'master': 3,
        'bachelor': 2,
        'associate': 1
    }
    
    resume_lower = resume_text.lower()
    requirements_lower = job_requirements.lower()
    
    # Find highest education level mentioned
    resume_level = 0
    req_level = 0
    
    for level, score in education_levels.items():
        if level in resume_lower:
            resume_level = max(resume_level, score)
        if level in requirements_lower:
            req_level = max(req_level, score)
    
    if req_level == 0:
        return 0.7  # Default score if no specific education requirement
    
    # Calculate match percentage
    match_score = min(resume_level / req_level, 1.0) if req_level > 0 else 0.5
    return match_score

def find_matching_skills(resume_text, job_requirements):
    """Find skills that match between resume and job requirements"""
    common_skills = [
        'Python', 'JavaScript', 'Java', 'C++', 'SQL', 'NoSQL', 'AWS', 
        'React', 'Node.js', 'API', 'ETL', 'Git', 'Docker', 'Kubernetes',
        'Machine Learning', 'Data Science', 'Backend', 'Frontend'
    ]
    
    resume_lower = resume_text.lower()
    requirements_lower = job_requirements.lower()
    
    matching_skills = []
    for skill in common_skills:
        if skill.lower() in resume_lower and skill.lower() in requirements_lower:
            matching_skills.append(skill)
    
    return matching_skills

def find_missing_requirements(resume_text, job_requirements):
    """Identify requirements missing from the resume"""
    # Extract requirement phrases
    req_patterns = [
        r'[-•]\s*([^•\n]+)',
        r'required:\s*([^•\n]+)',
        r'requirements:\s*([^•\n]+)'
    ]
    
    missing_reqs = []
    resume_lower = resume_text.lower()
    
    for pattern in req_patterns:
        matches = re.findall(pattern, job_requirements, re.IGNORECASE)
        for req in matches:
            req = req.strip()
            if req and req.lower() not in resume_lower:
                missing_reqs.append(req)
    
    return missing_reqs[:5]  # Return top 5 missing requirements

def generate_suggestions(resume_text, job_requirements):
    """Generate improvement suggestions based on analysis"""
    suggestions = []
    missing_reqs = find_missing_requirements(resume_text, job_requirements)
    
    if missing_reqs:
        suggestions.append("Add experience or skills in: " + ", ".join(missing_reqs))
    
    # Add more specific suggestions based on the analysis
    if len(resume_text.split()) < 300:
        suggestions.append("Add more detailed descriptions of your experience")
    
    if 'education' not in resume_text.lower():
        suggestions.append("Include your educational background")
    
    return suggestions

@app.route("/")  
def home():
    return jsonify({"message": "Welcome to HireFlow API!"})

@app.route("/api/analyze-resume", methods=["POST"])
def analyze_resume():
    if 'resume' not in request.files or 'job_requirements' not in request.form:
        return jsonify({"error": "Missing resume file or job requirements"}), 400
    
    try:
        resume_file = request.files['resume']
        job_requirements = request.form['job_requirements']
        
        # Extract text from PDF
        resume_text = extract_text_from_pdf(resume_file)
        if not resume_text:
            return jsonify({"error": "Failed to extract text from PDF"}), 400

        # Analyze resume against job requirements
        analysis_result = analyze_resume_against_job(resume_text, job_requirements)
        
        if not analysis_result:
            return jsonify({"error": "Failed to analyze resume"}), 500

        return jsonify({"analysis": analysis_result})

    except Exception as e:
        logging.error(f"Error analyzing resume: {str(e)}")
        return jsonify({"error": "Failed to analyze resume"}), 500

@app.route("/api/applicants", methods=["GET"])
def get_applicants():
    cursor.execute("SELECT * FROM applicants")
    applicants = cursor.fetchall()
    return jsonify({"applicants": applicants})

if __name__ == "__main__":
    app.run(debug=True)
