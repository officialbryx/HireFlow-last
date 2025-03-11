import fitz
from transformers import pipeline, AutoTokenizer, AutoModelForMaskedLM
import torch
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import xgboost as xgb
import os
import re
import spacy
from collections import Counter
import json
import nltk
import ssl
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from datetime import datetime

# Fix SSL certificate verification issue
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

# Download necessary NLTK data
def download_nltk_data():
    """Download required NLTK data with error handling"""
    required_packages = ['punkt', 'stopwords', 'punkt_tab']
    for package in required_packages:
        try:
            nltk.data.find(f'tokenizers/{package}')
        except LookupError:
            try:
                nltk.download(package)
            except Exception as e:
                print(f"Warning: Failed to download {package}: {str(e)}")

# Attempt to download NLTK data
download_nltk_data()

# Load spaCy model for NER and parsing
try:
    nlp = spacy.load("en_core_web_sm")
except:
    print("Downloading spaCy model...")
    import subprocess
    subprocess.call(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

# Define a fallback stopwords list in case NLTK download still fails
FALLBACK_STOPWORDS = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", 
    "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 
    'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 
    'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 
    'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 
    'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 
    'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 
    'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 
    'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 
    'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 
    'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 
    'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', 
    "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', 
    "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 
    'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
}

def read_job_post(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
        return None
    except Exception as e:
        print(f"Error: An unexpected error occurred: {str(e)}")
        return None

def extract_text_from_pdf(pdf_path):
    try:
        # Open the PDF file
        doc = fitz.open(pdf_path)
        
        # Initialize a string to store text
        text = ""
        
        # Extract text from each page
        for page in doc:
            text += page.get_text()
            
        # Close the document
        doc.close()
        return text.strip()
        
    except FileNotFoundError:
        print(f"Error: The file {pdf_path} was not found.")
        return None
    except Exception as e:
        print(f"Error: An unexpected error occurred: {str(e)}")
        return None

def extract_skills(text):
    """Extract both hard and soft skills from text"""
    # Hard (technical) skills
    hard_skills = [
        "python", "java", "javascript", "html", "css", "c++", "c#", "ruby",
        "php", "swift", "kotlin", "go", "rust", "scala", "perl", "typescript",
        "sql", "nosql", "mongodb", "mysql", "postgresql", "oracle", "firebase",
        "aws", "azure", "gcp", "cloud", "docker", "kubernetes", "terraform",
        "jenkins", "git", "github", "gitlab", "ci/cd", "devops", "agile", "scrum",
        "react", "angular", "vue", "node.js", "express", "django", "flask", "spring",
        "asp.net", "rails", "laravel", "tensorflow", "pytorch", "machine learning",
        "deep learning", "ai", "data science", "big data", "hadoop", "spark",
        "tableau", "power bi", "excel", "word", "powerpoint", "photoshop",
        "illustrator", "ui/ux", "figma", "sketch", "adobe xd", "rest api",
        "graphql", "microservices", "soa", "mobile development", "ios", "android",
        "react native", "flutter", "xamarin", "blockchain", "ethereum", "solidity",
        "network security", "penetration testing", "cybersecurity", "linux", "unix",
        "windows", "macos", "sap", "salesforce", "dynamics", "jira", "confluence",
        "accounting", "finance", "auditing", "tax", "financial analysis",
        "financial modeling", "budget", "forecasting", "bookkeeping", "gaap",
        "ifrs", "sap", "quickbooks", "xero", "cpa", "cfa", "mba", "agile",
        "project management", "marketing", "sales", "seo", "content", "social media",
        "brand management", "customer service", "human resources", "recruiting",
        "payroll", "benefits", "compensation", "healthcare", "nursing", "medicine",
        "physician", "pharma", "biotech", "lab techniques", "clinical trials",
        "mechanical engineering", "civil engineering", "electrical engineering",
        "industrial design", "architecture", "manufacturing", "supply chain",
        "logistics", "procurement", "inventory", "legal", "compliance", "regulatory",
        "teaching", "education", "curriculum", "instruction", "counseling",
        "psychology", "therapy", "social work", "hospitality", "culinary",
        "food service", "hotel", "restaurant", "retail", "merchandising",
        "ecommerce", "telecommunications", "networking", "aviation", "automotive",
        "construction", "energy", "oil", "gas", "renewable energy", "sustainability"
    ]
    
    # Add soft skills list
    soft_skills = [
        "communication", "leadership", "problem solving", "teamwork", "collaboration",
        "critical thinking", "adaptability", "flexibility", "time management",
        "organization", "analytical", "interpersonal", "negotiation", "presentation",
        "public speaking", "decision making", "conflict resolution", "mentoring",
        "coaching", "strategic thinking", "planning", "research", "attention to detail",
        "creative", "innovation", "initiative", "self-motivated", "team player",
        "multitasking", "stress management", "work ethic", "customer service",
        "business acumen", "project coordination", "resource management",
        "verbal communication", "written communication", "problem analysis",
        "relationship building", "cross-functional", "team leadership", "mentorship",
        "training", "staff development", "cultural awareness", "emotional intelligence"
    ]
    
    text = text.lower()
    
    # Find matches for both skill types
    found_hard_skills = [skill for skill in hard_skills if re.search(r'\b' + re.escape(skill) + r'\b', text)]
    found_soft_skills = [skill for skill in soft_skills if re.search(r'\b' + re.escape(skill) + r'\b', text)]
    
    # Extract additional skills using NLP
    doc = nlp(text)
    noun_phrases = [chunk.text.lower() for chunk in doc.noun_chunks]
    nouns = [token.text.lower() for token in doc if token.pos_ == "NOUN" and len(token.text) > 3]
    
    try:
        stop_words = set(stopwords.words('english'))
    except:
        stop_words = FALLBACK_STOPWORDS
    
    filtered_nouns = [noun for noun in nouns if noun not in stop_words]
    
    # Classify additional skills
    additional_skills = []
    soft_skill_patterns = [
        r'\b\w+ing\b',  # Words ending in 'ing' are often soft skills
        r'\b\w+ation\b',  # Words ending in 'ation' 
        r'\b(skilled|proficient|experienced|expertise)\s+in\s+([^.]+)'
    ]
    
    for noun in filtered_nouns:
        for pattern in soft_skill_patterns:
            if re.search(pattern, noun):
                found_soft_skills.append(noun)
            else:
                additional_skills.append(noun)
    
    # Count frequencies
    hard_skill_counts = Counter(found_hard_skills)
    soft_skill_counts = Counter(found_soft_skills)
    additional_skill_counts = Counter(additional_skills)
    
    return {
        "hard_skills": dict(hard_skill_counts.most_common(20)),
        "soft_skills": dict(soft_skill_counts.most_common(10)),
        "additional_skills": dict(additional_skill_counts.most_common(10))
    }

def simple_sentence_split(text):
    """Fallback sentence tokenization if NLTK fails"""
    # Split on common sentence endings
    text = re.sub(r'([.!?])\s+', r'\1|SPLIT|', text)
    # Split on newlines
    text = re.sub(r'\n+', '|SPLIT|', text)
    # Return sentences, filtering out empty ones
    return [s.strip() for s in text.split('|SPLIT|') if s.strip()]

# Define education keywords before extract_education function
education_keywords = [
    "bachelor", "master", "phd", "doctorate", "degree", 
    "bs", "ba", "ms", "ma", "mba", "bsc", "msc", "btech", "mtech",
    "university", "college", "institute", "school", "academy",
    "certification", "diploma", "graduate", "undergraduate",
    "major", "minor", "concentration", "specialization",
    "studied", "graduated", "education", "academic"
]

def extract_education(text):
    """Enhanced education information extraction"""
    education_patterns = [
        # Degree patterns
        r'(?:bachelor|master|phd|doctorate|associate)(?:\s+(?:of|in|degree))?\s+(?:of|in|degree)?\s+([^.]+)',
        r'(?:b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?a\.?|ph\.?d\.?|m\.?b\.?a\.?)\s+(?:in|of)?\s+([^.]+)',
        r'(?:bachelor|master|doctorate|graduate)\s+degree\s+(?:in|of)?\s+([^.]+)',
        
        # School/University patterns
        r'(?:university|college|institute|school)\s+of\s+([^.]+)',
        r'graduated\s+from\s+([^.]+)',
        r'studied\s+(?:at|in)\s+([^.]+)',
        
        # Year patterns
        r'(?:19|20)\d{2}(?:\s*-\s*(?:19|20)\d{2}|\s*-\s*present|\s*-\s*current)?',
        
        # GPA patterns
        r'gpa\s*(?:of)?\s*:?\s*([0-4]\.\d{1,2})',
        
        # Certification patterns
        r'certification\s+in\s+([^.]+)',
        r'certified\s+([^.]+)'
    ]
    
    education_info = []
    text_lower = text.lower()
    
    try:
        sentences = sent_tokenize(text)
    except:
        sentences = simple_sentence_split(text)
    
    for sentence in sentences:
        sent_lower = sentence.lower()
        
        # Check for education keywords
        if any(keyword in sent_lower for keyword in education_keywords):
            # Extract detailed information
            details = {
                "text": sentence.strip(),
                "degree": None,
                "field": None,
                "school": None,
                "year": None,
                "gpa": None
            }
            
            # Extract information using patterns
            for pattern in education_patterns:
                matches = re.finditer(pattern, sent_lower, re.IGNORECASE)
                for match in matches:
                    if "degree" in sent_lower or any(deg in sent_lower for deg in ["bachelor", "master", "phd"]):
                        details["degree"] = match.group(0)
                    elif "university" in sent_lower or "college" in sent_lower:
                        details["school"] = match.group(0)
                    elif re.search(r'(?:19|20)\d{2}', match.group(0)):
                        details["year"] = match.group(0)
                    elif "gpa" in sent_lower:
                        details["gpa"] = match.group(1)
                    else:
                        details["field"] = match.group(0)
            
            if any(details.values()):
                education_info.append(details)
    
    # Detect degree levels
    degree_levels = []
    if re.search(r'\b(phd|doctorate|doctoral)\b', text_lower):
        degree_levels.append("PhD")
    if re.search(r'\b(master|ms|ma|msc|mtech|mba)\b', text_lower):
        degree_levels.append("Master's")
    if re.search(r'\b(bachelor|bs|ba|bsc|btech|undergraduate)\b', text_lower):
        degree_levels.append("Bachelor's")
    if re.search(r'\b(diploma|associate|certification)\b', text_lower):
        degree_levels.append("Associate/Diploma")
    
    return {
        "details": education_info,
        "levels": degree_levels
    }

# Define job-related constants before extract_experience function
job_prefixes = [
    "senior", "junior", "lead", "principal", "staff", "chief", "head", 
    "director", "manager", "engineer", "developer", "architect", "analyst",
    "consultant", "specialist", "coordinator", "administrator"
]

job_title_patterns = [
    r'\b(?:senior|junior|lead|principal|staff|chief|head|director|manager)\s+[a-z\s]+(?:engineer|developer|architect|analyst|consultant)\b',
    r'\b[a-z\s]+(?:engineer|developer|architect|analyst|consultant)\b',
    r'\b(?:project|product|program)\s+manager\b',
    r'\b(?:team|technical|technology)\s+lead(?:er)?\b',
    r'\b(?:software|systems|solutions|data|cloud|security)\s+(?:engineer|architect|developer|analyst)\b',
    r'\b(?:full[\s-]stack|frontend|backend|devops)\s+(?:engineer|developer)\b',
    r'\b(?:c(?:\+\+|\#)?|java|python|javascript|ruby|php)\s+(?:engineer|developer)\b',
    r'\b(?:web|mobile|ui|ux)\s+(?:designer|developer)\b'
]

def extract_experience(text):
    """Enhanced work experience extraction"""
    experience_patterns = [
        # Years of experience
        r'(\d+)[\+]?\s*(?:year|yr)s?(?:\sof)?(?:\sexperience)?',
        r'experience\s*(?:of|with|for)?\s*(\d+)[\+]?\s*(?:year|yr)s?',
        r'(?:over|more\sthan)\s*(\d+)\s*(?:year|yr)s?(?:\sof)?(?:\sexperience)?',
        
        # Date ranges
        r'(?:19|20)\d{2}\s*-\s*(?:present|current|(?:19|20)\d{2})',
        r'(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]+(?:19|20)\d{2}',
        
        # Position patterns
        r'(?:position|title|role)(?:\s*:\s*|\s+as\s+)([^.]+)',
        r'(?:worked|serving|acted)\s+as\s+([^.]+)'
    ]
    
    text_lower = text.lower()
    years = []
    positions = []
    dates = []
    
    try:
        sentences = sent_tokenize(text)
    except:
        sentences = simple_sentence_split(text)
    
    for sentence in sentences:
        sent_lower = sentence.lower()
        
        # Extract years of experience
        for pattern in experience_patterns[:3]:
            matches = re.findall(pattern, sent_lower)
            years.extend([int(year) for year in matches])
        
        # Extract date ranges
        for pattern in experience_patterns[3:5]:
            dates.extend(re.findall(pattern, sentence, re.IGNORECASE))
        
        # Extract positions
        for pattern in experience_patterns[5:]:
            positions.extend(re.findall(pattern, sentence, re.IGNORECASE))
    
    # Extract job titles using spaCy
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON" and any(prefix in ent.text.lower() for prefix in job_prefixes):
            positions.append(ent.text)
    
    # Look for job titles using regex patterns
    for pattern in job_title_patterns:
        titles = re.findall(pattern, text, re.IGNORECASE)
        positions.extend([title.strip() for title in titles])
    
    # Calculate total years from date ranges
    total_years = 0
    for date_range in dates:
        if "-" in date_range:
            start, end = date_range.split("-")
            start_year = int(re.search(r'(?:19|20)\d{2}', start).group(0))
            if "present" in end.lower() or "current" in end.lower():
                end_year = datetime.now().year
            else:
                end_year = int(re.search(r'(?:19|20)\d{2}', end).group(0))
            total_years += end_year - start_year
    
    # Get the maximum years mentioned or calculated
    max_years = max([total_years] + years) if years or total_years else 0
    
    return {
        "years": max_years,
        "positions": list(set(positions)),
        "date_ranges": dates
    }

def analyze_job_requirements(job_text):
    """Extract key requirements from job description"""
    # Parse the job text
    doc = nlp(job_text)
    sentences = [sent.text for sent in doc.sents]
    
    requirements = {
        "skills": extract_skills(job_text),
        "education": extract_education(job_text),
        "experience": extract_experience(job_text),
        "required": [],
        "preferred": []
    }
    
    # Look for required vs preferred qualifications
    for sentence in sentences:
        sentence_lower = sentence.lower()
        if any(req in sentence_lower for req in ["required", "must have", "requirement", "necessary"]):
            requirements["required"].append(sentence.strip())
        elif any(pref in sentence_lower for pref in ["preferred", "nice to have", "desirable", "plus"]):
            requirements["preferred"].append(sentence.strip())
    
    return requirements

def analyze_resume(resume_text):
    """Extract key information from resume"""
    resume_info = {
        "skills": extract_skills(resume_text),
        "education": extract_education(resume_text),
        "experience": extract_experience(resume_text)
    }
    return resume_info

def compare_requirements(job_req, resume_info):
    """Enhanced comparison with adjusted weights and thresholds"""
    results = {
        "skill_match": {
            "matching": [],
            "missing": [],
            "additional": [],
            "match_percentage": 0
        },
        "education_match": {
            "sufficient": False,
            "details": ""
        },
        "experience_match": {
            "sufficient": False,
            "gap_years": 0,
            "details": ""
        },
        "overall_match": {
            "score": 0,
            "qualified": False,
            "reasons": []
        }
    }
    
    # Skill match analysis
    job_skills = set(job_req["skills"]["hard_skills"].keys())
    resume_skills = set(resume_info["skills"]["hard_skills"].keys())
    
    results["skill_match"]["matching"] = list(job_skills.intersection(resume_skills))
    results["skill_match"]["missing"] = list(job_skills - resume_skills)
    results["skill_match"]["additional"] = list(resume_skills - job_skills)
    
    if len(job_skills) > 0:
        results["skill_match"]["match_percentage"] = len(results["skill_match"]["matching"]) / len(job_skills) * 100
    
    # Education match analysis
    job_edu_levels = set(job_req["education"]["levels"]) if job_req["education"]["levels"] else {"Bachelor's"}
    resume_edu_levels = set(resume_info["education"]["levels"])
    
    edu_level_rank = {"PhD": 4, "Master's": 3, "Bachelor's": 2, "Associate/Diploma": 1}
    
    if resume_edu_levels:
        highest_job_edu = max([edu_level_rank.get(level, 0) for level in job_edu_levels])
        highest_resume_edu = max([edu_level_rank.get(level, 0) for level in resume_edu_levels])
        
        if highest_resume_edu >= highest_job_edu:
            results["education_match"]["sufficient"] = True
            results["education_match"]["details"] = f"Resume shows {', '.join(resume_edu_levels)} education, which meets or exceeds the required {', '.join(job_edu_levels)}"
        else:
            results["education_match"]["details"] = f"Resume shows {', '.join(resume_edu_levels)} education, which is below the required {', '.join(job_edu_levels)}"
    else:
        results["education_match"]["details"] = "No clear education information found in the resume"
    
    # Experience match analysis
    required_years = job_req["experience"]["years"] if job_req["experience"]["years"] else 1
    resume_years = resume_info["experience"]["years"]
    
    if resume_years >= required_years:
        results["experience_match"]["sufficient"] = True
        results["experience_match"]["details"] = f"Resume shows {resume_years} years of experience, which meets the required {required_years} years"
    else:
        results["experience_match"]["gap_years"] = required_years - resume_years
        results["experience_match"]["details"] = f"Resume shows {resume_years} years of experience, which is below the required {required_years} years"
    
    # Adjust weights to emphasize skills and experience
    skill_weight = 0.4  # Reduced from 0.5
    education_weight = 0.2  # Reduced from 0.25
    experience_weight = 0.3  # Increased from 0.25
    soft_skills_weight = 0.1  # New weight for soft skills
    
    # Calculate skill scores separately for hard and soft skills
    hard_skills_score = len(set(job_req["skills"]["hard_skills"]) & set(resume_info["skills"]["hard_skills"])) / len(job_req["skills"]["hard_skills"]) if job_req["skills"]["hard_skills"] else 1.0
    soft_skills_score = len(set(job_req["skills"]["soft_skills"]) & set(resume_info["skills"]["soft_skills"])) / len(job_req["skills"]["soft_skills"]) if job_req["skills"]["soft_skills"] else 1.0
    
    # Calculate weighted skill score
    skill_score = (hard_skills_score * 0.7 + soft_skills_score * 0.3) * results["skill_match"]["match_percentage"] / 100
    
    # Calculate education score
    education_score = 1.0 if results["education_match"]["sufficient"] else 0.4
    
    # Calculate experience score
    if results["experience_match"]["sufficient"]:
        experience_score = 1.0
    else:
        gap_ratio = max(0, resume_years / required_years) if required_years > 0 else 1.0
        experience_score = min(gap_ratio, 0.8)  # Cap at 0.8 if requirements not fully met
    
    # Adjust qualification threshold
    qualification_threshold = 0.55  # Reduced from 0.6 to be less strict
    
    overall_score = (
        skill_score * skill_weight +
        education_score * education_weight +
        experience_score * experience_weight +
        soft_skills_score * soft_skills_weight
    )
    
    results["overall_match"]["score"] = overall_score * 100
    results["overall_match"]["qualified"] = overall_score > qualification_threshold
    
    # Generate reasons for the decision
    if results["overall_match"]["qualified"]:
        results["overall_match"]["reasons"].append(f"Candidate has {len(results['skill_match']['matching'])} of the required skills")
        if results["education_match"]["sufficient"]:
            results["overall_match"]["reasons"].append("Education requirements are met")
        if results["experience_match"]["sufficient"]:
            results["overall_match"]["reasons"].append(f"Experience requirement of {required_years} years is met")
    else:
        if results["skill_match"]["match_percentage"] < 50:
            results["overall_match"]["reasons"].append(f"Candidate is missing {len(results['skill_match']['missing'])} key skills: {', '.join(results['skill_match']['missing'][:5])}")
        if not results["education_match"]["sufficient"]:
            results["overall_match"]["reasons"].append(f"Education requirement not met: {results['education_match']['details']}")
        if not results["experience_match"]["sufficient"]:
            results["overall_match"]["reasons"].append(f"Insufficient experience: {results['experience_match']['gap_years']} more years needed")
    
    return results

def get_bert_embedding(text, model, tokenizer, max_length=512):
    # Tokenize and encode the text
    inputs = tokenizer(text, return_tensors="pt", max_length=max_length, 
                      truncation=True, padding=True)
    
    # Get model output
    with torch.no_grad():
        # Get the hidden states from the model
        outputs = model(input_ids=inputs['input_ids'], 
                       attention_mask=inputs['attention_mask'],
                       output_hidden_states=True)
        
        # Get the embeddings from the last hidden state (second to last layer)
        # Using [-2] since the last layer is the MLM head
        hidden_states = outputs.hidden_states[-2]
        
        # Use CLS token embedding (first token) as the text representation
        sentence_embedding = hidden_states[:, 0, :].numpy()
        
    return sentence_embedding[0]

def calculate_similarity(job_embedding, resume_embedding):
    # Reshape embeddings for cosine_similarity
    job_embedding = job_embedding.reshape(1, -1)
    resume_embedding = resume_embedding.reshape(1, -1)
    
    # Calculate cosine similarity
    similarity = cosine_similarity(job_embedding, resume_embedding)[0][0]
    return similarity

def analyze_similarity_explanation(job_content, resume_content, similarity_score):
    """Analyze why the similarity score is high or low based on content analysis"""
    explanation = []
    
    # Convert texts to lowercase for easier comparison
    job_lower = job_content.lower()
    resume_lower = resume_content.lower()
    
    # Check length - similar lengths might contribute to similarity
    job_len = len(job_content.split())
    resume_len = len(resume_content.split())
    len_ratio = min(job_len, resume_len) / max(job_len, resume_len)
    
    if len_ratio > 0.8:
        explanation.append("- Similar document lengths may contribute to higher similarity scores")
    
    # Common keywords that might appear in job posts and resumes
    tech_keywords = ["python", "java", "javascript", "html", "css", "sql", "database", 
                     "api", "aws", "cloud", "web", "development", "software", "engineer", 
                     "programming", "developer", "full-stack", "frontend", "backend"]
    
    # Count matching keywords
    matching_keywords = [kw for kw in tech_keywords if kw in job_lower and kw in resume_lower]
    
    if matching_keywords:
        explanation.append(f"- Matching technical keywords found in both documents: {', '.join(matching_keywords)}")
    
    # Check for education terms match
    education_terms = ["bachelor", "master", "phd", "degree", "university", "college", "certification"]
    matching_edu = [term for term in education_terms if term in job_lower and term in resume_lower]
    
    if matching_edu:
        explanation.append(f"- Matching education terms: {', '.join(matching_edu)}")
    
    # Check for experience level match
    experience_terms = ["year", "experience", "senior", "junior", "mid-level", "expert"]
    matching_exp = [term for term in experience_terms if term in job_lower and term in resume_lower]
    
    if matching_exp:
        explanation.append(f"- Matching experience terms: {', '.join(matching_exp)}")
    
    # JobBERT explanation
    explanation.append("- JobBERT is specifically trained on job-related content and can identify semantic relationships")
    explanation.append("- High similarity scores (>0.9) typically indicate very strong content alignment")
    
    if similarity_score > 0.95:
        explanation.append("- The extremely high similarity (>0.95) suggests the resume is very well tailored to this job")
    
    # XGBoost threshold explanation
    explanation.append(f"- The qualification threshold is set at 0.5, and the score of {similarity_score:.4f} is well above this")
    
    return explanation

def train_xgboost_model(similarity_score):
    # This is a simple example - in practice, you'd want to train on a larger dataset
    # Here we're using a basic threshold-based approach
    X = np.array([[similarity_score]])
    
    # Create a simple XGBoost model
    model = xgb.XGBClassifier()
    
    # Define threshold - this should be tuned based on your data
    threshold = 0.5
    
    # Make prediction (1 for qualified, 0 for not qualified)
    prediction = 1 if similarity_score > threshold else 0
    
    return prediction, similarity_score

if __name__ == "__main__":
    print("AI Recruiter - Resume Analysis System")
    print("====================================")
    
    # Load JobBERT model and tokenizer
    try:
        print("Loading JobBERT model and tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained("jjzha/jobbert-base-cased")
        model = AutoModelForMaskedLM.from_pretrained("jjzha/jobbert-base-cased")
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        print("Make sure you have installed the transformers library and have internet connection")
        exit(1)
    
    # Specify file paths - allowing command line input or using default
    import sys
    
    if len(sys.argv) >= 3:
        job_post_path = sys.argv[1]
        pdf_path = sys.argv[2]
    else:
        # Default paths - replace with your actual file paths
        job_post_path = input("Enter the path to the job post file: ")
        pdf_path = input("Enter the path to the resume PDF file: ")
    
    # Check if files exist
    if not os.path.exists(job_post_path):
        print(f"Error: Job post file not found at {job_post_path}")
        exit(1)
        
    if not os.path.exists(pdf_path):
        print(f"Error: Resume PDF file not found at {pdf_path}")
        exit(1)
    
    print(f"Processing job post: {job_post_path}")
    print(f"Processing resume: {pdf_path}")
    
    # Read job post and resume
    job_post_content = read_job_post(job_post_path)
    resume_content = extract_text_from_pdf(pdf_path)
    
    if job_post_content and resume_content:
        print("\nPerforming detailed content analysis...")
        
        # Analyze job and resume
        job_requirements = analyze_job_requirements(job_post_content)
        resume_info = analyze_resume(resume_content)
        
        # Compare requirements with resume
        comparison_results = compare_requirements(job_requirements, resume_info)
        
        # Get embeddings for semantic similarity
        job_embedding = get_bert_embedding(job_post_content, model, tokenizer)
        resume_embedding = get_bert_embedding(resume_content, model, tokenizer)
        semantic_similarity = calculate_similarity(job_embedding, resume_embedding)
        
        # Print analysis results
        print("\n=== AI Recruiter Analysis ===")
        print(f"Overall Match Score: {comparison_results['overall_match']['score']:.2f}%")
        print(f"Qualification Status: {'QUALIFIED' if comparison_results['overall_match']['qualified'] else 'NOT QUALIFIED'}")
        
        print("\n=== Skills Analysis ===")
        print(f"Match Rate: {comparison_results['skill_match']['match_percentage']:.2f}%")
        print(f"Matching Skills: {', '.join(comparison_results['skill_match']['matching'][:10])}")
        if comparison_results['skill_match']['missing']:
            print(f"Missing Key Skills: {', '.join(comparison_results['skill_match']['missing'][:10])}")
        
        print("\n=== Education Analysis ===")
        print(comparison_results['education_match']['details'])
        
        print("\n=== Experience Analysis ===")
        print(comparison_results['experience_match']['details'])
        if resume_info['experience']['positions']:
            print(f"Relevant Job Titles: {', '.join(resume_info['experience']['positions'][:5])}")
        
        print("\n=== Decision Reasoning ===")
        for reason in comparison_results['overall_match']['reasons']:
            print(f"- {reason}")
        
        print(f"\nSemantic Similarity Score: {semantic_similarity:.4f}")
        
        print("\n=== Job Requirements Summary ===")
        print(f"Required Skills: {', '.join(list(job_requirements['skills']['hard_skills'].keys())[:10])}")
        if job_requirements['education']['levels']:
            print(f"Education Level: {', '.join(job_requirements['education']['levels'])}")
        print(f"Years of Experience: {job_requirements['experience']['years']}")
        
        print("\n=== Resume Skills Summary ===")
        print(f"Skills Found: {', '.join(list(resume_info['skills']['hard_skills'].keys())[:10])}")
        if resume_info['education']['levels']:
            print(f"Education Level: {', '.join(resume_info['education']['levels'])}")
        print(f"Years of Experience: {resume_info['experience']['years']}")
        
        # Save detailed analysis to a file
        analysis_file = os.path.join(os.path.dirname(job_post_path), "resume_analysis.json")
        with open(analysis_file, 'w') as f:
            analysis_data = {
                "job_requirements": job_requirements,
                "resume_info": resume_info,
                "comparison_results": comparison_results,
                "semantic_similarity": float(semantic_similarity)
            }
            json.dump(analysis_data, f, indent=2)
            
        print(f"\nDetailed analysis saved to {analysis_file}")
        
        # Also print full job post and resume content as requested
        print("\n=== Job Post Content ===")
        print(job_post_content)
        print("\n" + "="*30 + "\n")
        
        print("=== Resume Content ===")
        print(resume_content)
        print("=" * 30)
    else:
        print("Failed to read job post or resume content.")