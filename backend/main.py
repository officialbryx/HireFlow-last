import sys
import os
import fitz
import torch
from transformers import AutoTokenizer, AutoModelForMaskedLM
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import spacy
import json
from datetime import datetime
from collections import Counter
import re
import nltk
import ssl
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

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
    required_packages = ['punkt', 'stopwords']
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
        # Extract text from each page with improved handling
        for page in doc:
            # Get text with preservation of layout
            page_text = page.get_text("text")
            text += page_text + "\n\n"  # Add extra newlines between pages
        # Close the document
        doc.close()
        return text.strip()
    except FileNotFoundError:
        print(f"Error: The file {pdf_path} was not found.")
        return None
    except Exception as e:
        print(f"Error: An unexpected error occurred: {str(e)}")
        return None

def extract_skills_with_jobbert(text):
    """Extract skills using JobBERT embeddings"""
    # Split text into sentences
    sentences = sent_tokenize(text)
    skills = {"hard_skills": {}, "soft_skills": {}}
    
    # Process each sentence
    for sentence in sentences:
        # Get sentence embedding
        sentence_emb = get_bert_embedding(sentence)
        
        # Compare with known skill embeddings
        doc = nlp(sentence)
        for chunk in doc.noun_chunks:
            chunk_text = chunk.text.lower()
            chunk_emb = get_bert_embedding(chunk_text)
            
            # Calculate similarity with technical and soft skill contexts
            tech_context = get_bert_embedding("technical skill programming development")
            soft_context = get_bert_embedding("soft skill communication teamwork")
            
            tech_sim = cosine_similarity(chunk_emb, tech_context)[0][0]
            soft_sim = cosine_similarity(chunk_emb, soft_context)[0][0]
            
            # Classify based on similarity
            if tech_sim > 0.5 or soft_sim > 0.5:
                if tech_sim > soft_sim:
                    skills["hard_skills"][chunk_text] = skills["hard_skills"].get(chunk_text, 0) + 1
                else:
                    skills["soft_skills"][chunk_text] = skills["soft_skills"].get(chunk_text, 0) + 1
    
    return skills

def simple_sentence_split(text):
    """Fallback sentence tokenization if NLTK fails"""
    # Split on common sentence endings
    text = re.sub(r'([.!?])\s+', r'\1|SPLIT|', text)
    # Split on newlines
    text = re.sub(r'\n+', '|SPLIT|', text)
    # Return sentences, filtering out empty ones
    return [s.strip() for s in text.split('|SPLIT|') if s.strip()]

def perform_resume_analysis(text):
    """Perform comprehensive resume analysis and return formatted results"""
    analysis = {
        "personal_info": extract_personal_info(text),
        "summary": extract_summary(text),
        "skills": extract_skills(text),
        "education": extract_education(text),
        "experience": extract_experience(text),
        "certifications": extract_certifications(text),
        "projects": extract_projects(text),
        "languages": extract_languages(text),
        "achievements": extract_achievements(text)
    }
    return analysis

# Define education keywords before extract_education function
education_keywords = [
    "bachelor", "master", "phd", "doctorate", "degree", 
    "bs", "ba", "ms", "ma", "mba", "bsc", "msc", "btech", "mtech",
    "university", "college", "institute", "school", "academy",
    "certification", "diploma", "graduate", "undergraduate",
    "major", "minor", "concentration", "specialization",
    "studied", "graduated", "education", "academic"
]

def extract_skills(text):
    """Extract skills from text with enhanced detection"""
    skills = {
        "hard_skills": {},
        "soft_skills": {}
    }
    
    # Common technical skills patterns
    tech_patterns = [
        r'\b(?:Python|Java|C\+\+|JavaScript|React|Node\.js|SQL|AWS|Azure|Docker|Kubernetes|Git|REST|API)\b',
        r'\b(?:Machine Learning|AI|Deep Learning|Data Science|Cloud Computing|DevOps|Full Stack|Backend|Frontend)\b',
        r'\b(?:HTML5?|CSS3?|MongoDB|MySQL|PostgreSQL|Redis|GraphQL|Jenkins|Linux|Unix|Agile|Scrum)\b'
    ]
    
    # Common soft skills patterns
    soft_patterns = [
        r'\b(?:Communication|Leadership|Management|Problem[\s-]Solving|Team[\s-]Work|Collaboration)\b',
        r'\b(?:Critical[\s-]Thinking|Time[\s-]Management|Project[\s-]Management|Decision[\s-]Making)\b',
        r'\b(?:Adaptability|Flexibility|Creativity|Innovation|Analysis|Planning|Organization)\b'
    ]
    
    # Process text with spaCy for better context understanding
    doc = nlp(text)
    
    # Extract skills using patterns
    for pattern in tech_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            skill = match.group(0).lower()
            skills["hard_skills"][skill] = skills["hard_skills"].get(skill, 0) + 1
            
    for pattern in soft_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            skill = match.group(0).lower()
            skills["soft_skills"][skill] = skills["soft_skills"].get(skill, 0) + 1
    
    # Extract additional skills using noun chunks and context
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.lower()
        # Check if the chunk is near skill-related words
        context_window = doc[max(0, chunk.start - 3):min(len(doc), chunk.end + 3)]
        context_text = context_window.text.lower()
        
        if any(word in context_text for word in ["experience", "proficient", "skilled", "expertise", "knowledge"]):
            # Determine if it's more likely a hard or soft skill
            if any(tech_word in chunk_text for tech_word in ["software", "programming", "technical", "development", "system"]):
                skills["hard_skills"][chunk_text] = skills["hard_skills"].get(chunk_text, 0) + 1
            elif any(soft_word in chunk_text for soft_word in ["communication", "management", "leadership", "team"]):
                skills["soft_skills"][chunk_text] = skills["soft_skills"].get(chunk_text, 0) + 1
    
    # Clean up skills (remove common words and very short terms)
    for skill_type in ["hard_skills", "soft_skills"]:
        skills[skill_type] = {
            k: v for k, v in skills[skill_type].items()
            if len(k) > 2 and k not in FALLBACK_STOPWORDS
        }
    
    return skills

def extract_education(text):
    """Enhanced education information extraction with improved PDF handling"""
    education_patterns = [
        # Degree patterns
        r'(?:bachelor|master|phd|doctorate|associate)(?:\s+(?:of|in|degree))?\s+([^.]+)',
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
    # New simple education detection patterns
    university_pattern = r'(?:University|College|Institute|School)[^,\n]*'
    degree_pattern = r'(?:Bachelor|Master|Ph\.?D\.?|MBA|B\.S\.|M\.S\.|B\.A\.|M\.A\.|Doctorate|BS|BA|MS|MA)[^,\n]*'
    year_pattern = r'(?:19|20)\d{2}'
    education_info = []
    text_lower = text.lower()
    degrees = []  # Initialize degrees list

    # First use the complex detection
    try:
        sentences = sent_tokenize(text)
    except:
        sentences = simple_sentence_split(text)

    # Find all degrees using the degree pattern
    degrees = re.findall(degree_pattern, text, re.IGNORECASE)
    
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
    # If no education found with complex detection, try simple detection
    if not education_info:
        # Find all universities/colleges
        universities = re.findall(university_pattern, text, re.IGNORECASE)
        degrees = re.findall(degree_pattern, text, re.IGNORECASE)
        years = re.findall(year_pattern, text)
        # If we found university and degree, create entries
        if universities and degrees:
            for i in range(min(len(universities), len(degrees))):
                details = {
                    "text": f"{degrees[i]} from {universities[i]}",
                    "degree": degrees[i].strip(),
                    "field": None,
                    "school": universities[i].strip(),
                    "year": years[i] if i < len(years) else None,
                    "gpa": None
                }
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
    # If we found degrees in our simple scan but no degree levels
    if degrees and not degree_levels:
        for degree in degrees:
            degree_lower = degree.lower()
            if "phd" in degree_lower or "doctorate" in degree_lower:
                degree_levels.append("PhD")
            elif "master" in degree_lower or "ms " in degree_lower or "ma " in degree_lower or "mba" in degree_lower:
                degree_levels.append("Master's")
            elif "bachelor" in degree_lower or "bs " in degree_lower or "ba " in degree_lower:
                degree_levels.append("Bachelor's")
            elif "associate" in degree_lower or "diploma" in degree_lower:
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

def extract_personal_info(text):
    """Extract personal information from resume"""
    # Initialize personal info dictionary
    personal_info = {
        "name": None,
        "email": None,
        "phone": None,
        "location": None,
        "website": None
    }
    # Extract email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    if emails:
        personal_info["email"] = emails[0]
    # Extract phone number
    phone_patterns = [
        r'\b(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b',  # (123) 456-7890, 123-456-7890
        r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b'  # 123-456-7890
    ]
    for pattern in phone_patterns:
        phones = re.findall(pattern, text)
        if phones:
            personal_info["phone"] = phones[0]
            break

    # Try to extract name using NER
    doc = nlp(text[:500])  # Only check the beginning of the resume
    person_entities = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    if person_entities:
        personal_info["name"] = person_entities[0]
    # Try to extract location
    locations = [ent.text for ent in doc.ents if ent.label_ == "GPE" or ent.label_ == "LOC"]
    if locations:
        personal_info["location"] = locations[0]
    return personal_info

def extract_certifications(text):
    """Extract certifications from resume"""
    certification_patterns = [
        r'(?:certification|certificate|certified|cert)(?:\sin|\sas|\s-|\s–|\s—|\s:|:)?\s+([^,.\n]+)',
        r'(?:AWS|Microsoft|Google|CompTIA|Cisco|Oracle|PMI|ITIL|PMP|CISSP|CISA|CEH|CCNA|MCSA|MCSE|MCTS|AZ-|AI-|DP-|SC-)\s*[-:]?\s*\d*\s*[A-Za-z0-9\s]+',
        r'(?:AWS|Azure|GCP)\s+Certified\s+[A-Za-z\s]+'
    ]
    certifications = []
    try:
        sentences = sent_tokenize(text)
    except:
        sentences = simple_sentence_split(text)
    for sentence in sentences:
        for pattern in certification_patterns:
            matches = re.findall(pattern, sentence, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    match = match[0]
                if len(match.strip()) > 3:  # Avoid short matches
                    certifications.append(match.strip())
    # Remove duplicates and limit
    return list(set(certifications))[:10]

def extract_projects(text):
    """Extract projects from resume"""
    project_patterns = [
        r'(?:project|developed|implemented|created|built|designed):?\s+([^.]+)',
        r'(?:project|developed|implemented|created|built|designed)\s+[a-z]*\s+([^.]+)',
        r'project\s+title:?\s+([^.]+)'
    ]
    projects = []
    try:
        sentences = sent_tokenize(text)
    except:
        sentences = simple_sentence_split(text)
    for sentence in sentences:
        if "project" in sentence.lower():
            for pattern in project_patterns:
                matches = re.findall(pattern, sentence, re.IGNORECASE)
                for match in matches:
                    if isinstance(match, tuple):
                        match = match[0]
                    if len(match.strip()) > 5:  # Avoid short matches
                        projects.append({"name": match.strip(), "description": sentence})
    return projects[:5]  # Limit to 5 projects

def extract_languages(text):
    """Extract language proficiencies from resume"""
    language_patterns = [
        r'(?:language|languages|fluent in|proficient in):?\s+([^.]+)',
        r'(?:English|Spanish|French|German|Chinese|Japanese|Italian|Russian|Arabic|Portuguese|Hindi)(?:\s+(?:native|fluent|proficient|advanced|intermediate|beginner))?'
    ]
    languages = []
    try:
        sentences = sent_tokenize(text)
    except:
        sentences = simple_sentence_split(text)
    for sentence in sentences:
        if "language" in sentence.lower() or any(lang in sentence for lang in ["English", "Spanish", "French", "German"]):
            for pattern in language_patterns:
                matches = re.findall(pattern, sentence, re.IGNORECASE)
                for match in matches:
                    if isinstance(match, tuple):
                        match = match[0]
                    if len(match.strip()) > 2:  # Avoid short matches
                        languages.append(match.strip())
    return list(set(languages))  # Remove duplicates

def extract_summary(text):
    """Extract professional summary from resume"""
    summary_patterns = [
        r'(?:summary|profile|objective|about me|professional summary)(?:\s*:\s*|\s*\n\s*)([^.]*(?:\.[^.]*){0,3})',
        r'(?:experienced|skilled|professional|dedicated|results-driven|motivated|detail-oriented)(?:[^.]*(?:\.[^.]*){0,3})'
    ]
    # Get the first 1000 characters for the summary search
    first_part = text[:1000]
    try:
        sentences = sent_tokenize(first_part)
    except:
        sentences = simple_sentence_split(first_part)
    
    # First, look for explicit summary sections
    for sentence in sentences[:5]:  # Only check first few sentences
        for pattern in summary_patterns:
            matches = re.findall(pattern, sentence, re.IGNORECASE)
            if matches:
                for match in matches:
                    if len(match) > 30:  # Must be substantive
                        return match.strip()
    
    # If no explicit summary, use first 2-3 substantive sentences
    substantive_sentences = [s for s in sentences if len(s) > 40]  # Only longer sentences
    if substantive_sentences:
        return ' '.join(substantive_sentences[:2])
    return None

def extract_achievements(text):
    """Extract achievements and awards from resume"""
    achievement_patterns = [
        r'(?:achievement|accomplishment|award|honor|recognition|won|received|granted|earned):?\s+([^.]+)',
        r'(?:recipient of|awarded)\s+([^.]+)'
    ]
    achievements = []
    try:
        sentences = sent_tokenize(text)
    except:
        sentences = simple_sentence_split(text)
    for sentence in sentences:
        for pattern in achievement_patterns:
            matches = re.findall(pattern, sentence, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    match = match[0]
                if len(match.strip()) > 3:  # Avoid short matches
                    achievements.append(match.strip())
    return achievements

def analyze_job_requirements(text):
    """Extract job requirements from job posting"""
    return {
        "skills": extract_skills(text),
        "education": extract_education(text),
        "experience": extract_experience(text)
    }

def get_bert_embedding(text, model, tokenizer):
    """Get BERT embedding for text with proper truncation and chunking"""
    BERT_MAX_LENGTH = 512  # BERT's maximum sequence length
    
    # Tokenize with explicit max length and truncation
    inputs = tokenizer(
        text,
        max_length=BERT_MAX_LENGTH,
        padding='max_length',
        truncation=True,
        return_tensors="pt"
    )
    
    # Process in batches
    embeddings_list = []
    with torch.no_grad():
        # Get embeddings from the hidden states
        outputs = model(**inputs, output_hidden_states=True)
        # Use the hidden states from the last layer
        hidden_states = outputs.hidden_states[-1]
        # Mean pooling
        mask = inputs['attention_mask'].unsqueeze(-1)
        embeddings = torch.sum(hidden_states * mask, dim=1) / torch.sum(mask, dim=1)
        embeddings_list.append(embeddings)

        # If text is longer than max length, process additional chunks
        if len(tokenizer.encode(text)) > BERT_MAX_LENGTH:
            # Split remaining text into chunks
            words = text.split()
            chunk_size = BERT_MAX_LENGTH // 2  # Use smaller chunks to ensure fitting
            for i in range(BERT_MAX_LENGTH, len(words), chunk_size):
                chunk = ' '.join(words[i:i + chunk_size])
                if not chunk:
                    continue
                    
                # Process chunk
                chunk_inputs = tokenizer(
                    chunk,
                    max_length=BERT_MAX_LENGTH,
                    padding='max_length',
                    truncation=True,
                    return_tensors="pt"
                )
                chunk_outputs = model(**chunk_inputs, output_hidden_states=True)
                # Use hidden states from last layer for this chunk too
                chunk_hidden_states = chunk_outputs.hidden_states[-1]
                chunk_mask = chunk_inputs['attention_mask'].unsqueeze(-1)
                chunk_embeddings = torch.sum(chunk_hidden_states * chunk_mask, dim=1) / torch.sum(chunk_mask, dim=1)
                embeddings_list.append(chunk_embeddings)

    # Average all embeddings if we processed multiple chunks
    if len(embeddings_list) > 1:
        final_embedding = torch.mean(torch.cat(embeddings_list, dim=0), dim=0, keepdim=True)
    else:
        final_embedding = embeddings_list[0]
        
    return final_embedding.numpy()

def calculate_similarity(embedding1, embedding2):
    """Calculate cosine similarity between embeddings"""
    return cosine_similarity(embedding1, embedding2)[0][0]

def compare_requirements(job_req, resume_info):
    """Enhanced comparison with adjusted weights and thresholds"""
    results = {
        "skill_match": {"match_percentage": 0, "missing": []},
        "education_match": {"sufficient": False},
        "experience_match": {"sufficient": False, "gap_years": 0},
        "overall_match": {"score": 0, "qualified": False}
    }
    # Calculate weights
    weights = {
        "skills": 0.4,
        "education": 0.3,
        "experience": 0.3
    }
    # Compare skills
    required_skills = set([s.lower() for s in job_req["skills"]["hard_skills"].keys()])
    candidate_skills = set([s.lower() for s in resume_info["skills"]["hard_skills"].keys()])
    matched_skills = required_skills & candidate_skills
    results["skill_match"]["match_percentage"] = len(matched_skills) / len(required_skills) * 100 if required_skills else 100
    results["skill_match"]["missing"] = list(required_skills - candidate_skills)

    # Compare education
    required_levels = set(job_req["education"]["levels"])
    candidate_levels = set(resume_info["education"]["levels"])
    results["education_match"]["sufficient"] = bool(required_levels & candidate_levels)

    # Compare experience
    required_years = job_req["experience"]["years"]
    resume_years = resume_info["experience"]["years"]
    results["experience_match"]["sufficient"] = resume_years >= required_years
    results["experience_match"]["gap_years"] = max(0, required_years - resume_years)

    # Calculate weighted score
    skill_score = results["skill_match"]["match_percentage"] / 100
    education_score = 1.0 if results["education_match"]["sufficient"] else 0.4
    experience_score = 1.0 if results["experience_match"]["sufficient"] else min(resume_years / required_years if required_years > 0 else 1.0, 0.8)

    total_score = (
        skill_score * weights["skills"] +
        education_score * weights["education"] +
        experience_score * weights["experience"]
    ) * 100

    results["overall_match"]["score"] = total_score
    results["overall_match"]["qualified"] = total_score >= 65
    return results

if __name__ == "__main__":
    print("AI Resume Analyzer")
    print("=================")
    
    # Get file paths from command line or ask user
    if len(sys.argv) >= 3:
        job_post_path = sys.argv[1]
        pdf_path = sys.argv[2]
    else:
        job_post_path = input("Enter the path to the job post file: ")
        pdf_path = input("Enter the path to the resume PDF file: ")

    # Check if files exist
    if not os.path.exists(job_post_path):
        print(f"Error: Job post file not found at {job_post_path}")
        exit(1)
        
    if not os.path.exists(pdf_path):
        print(f"Error: Resume PDF file not found at {pdf_path}")
        exit(1)

    # Read files
    job_post_content = read_job_post(job_post_path)
    resume_content = extract_text_from_pdf(pdf_path)

    if job_post_content and resume_content:
        # Load JobBERT model and tokenizer
        print("\nLoading natural language processing models...")
        try:
            tokenizer = AutoTokenizer.from_pretrained("jjzha/jobbert-base-cased")
            model = AutoModelForMaskedLM.from_pretrained("jjzha/jobbert-base-cased")
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            exit(1)

        # Perform analysis
        print("\nAnalyzing resume...")
        resume_analysis = perform_resume_analysis(resume_content)
        print("\n=== Job Requirements Analysis ===\n")
        job_requirements = analyze_job_requirements(job_post_content)
        
        # Compare requirements with resume
        comparison_results = compare_requirements(job_requirements, resume_analysis)
        
        # Get semantic similarity
        job_embedding = get_bert_embedding(job_post_content, model, tokenizer)
        resume_embedding = get_bert_embedding(resume_content, model, tokenizer)
        semantic_similarity = calculate_similarity(job_embedding, resume_embedding)

        print("\n=== Qualification Analysis ===")
        print(f"Overall Match Score: {comparison_results['overall_match']['score']:.2f}%")
        print(f"Semantic Similarity: {semantic_similarity:.4f}")
        print(f"Qualification Status: {'✅ QUALIFIED' if comparison_results['overall_match']['qualified'] else 'NOT QUALIFIED'}")

        print("\n📊 Skills Gap Analysis:")
        if comparison_results['skill_match']['missing']:
            print("   Missing Required Skills:")
            for skill in comparison_results['skill_match']['missing']:
                print(f"    {skill}")

        if not resume_analysis["education"]["details"]:
            print("\n Education Requirements Not Met:")
            print("   No formal education details detected in resume")

        if not comparison_results['experience_match']['sufficient']:
            print(f"\n Experience Gap: {comparison_results['experience_match']['gap_years']} years short of requirement")