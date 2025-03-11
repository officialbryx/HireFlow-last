from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
import re
import os
import fitz  # PyMuPDF for PDF reading

app = Flask(__name__)
CORS(app)

# Initialize JobBERT model and tokenizer
model_name = "jjzha/jobbert-base-cased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

# Function to extract embeddings from text using JobBERT
def get_embeddings(text):
    # Clean and truncate text if needed
    text = re.sub(r'\s+', ' ', text).strip()
    if len(text) > 512:
        text = text[:512]
    
    # Tokenize and get embeddings
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Use CLS token embedding as the document embedding
    embeddings = outputs.last_hidden_state[:, 0, :].numpy()
    return embeddings[0]

# Simple XGBoost model for resume ranking (would be trained properly in production)
def create_simple_model():
    # In production, this would be a properly trained model
    # For this demo, we'll create a simple model that looks for keywords
    return xgb.XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=5)

# Pre-trained model that we're simulating
xgb_model = create_simple_model()

# Load resume data
def load_resume_data():
    people_path = os.path.join("dataset", "resumes", "01_people.csv")
    abilities_path = os.path.join("dataset", "resumes", "02_abilities.csv")
    education_path = os.path.join("dataset", "resumes", "03_education.csv")
    experience_path = os.path.join("dataset", "resumes", "04_experience.csv")
    skills_path = os.path.join("dataset", "resumes", "06_skills.csv")
    
    people = pd.read_csv(people_path)
    abilities = pd.read_csv(abilities_path) if os.path.exists(abilities_path) else pd.DataFrame(columns=['person_id', 'ability'])
    education = pd.read_csv(education_path) if os.path.exists(education_path) else pd.DataFrame(columns=['person_id', 'institution', 'program', 'start_date', 'location'])
    experience = pd.read_csv(experience_path) if os.path.exists(experience_path) else pd.DataFrame(columns=['person_id', 'title', 'firm', 'start_date', 'end_date', 'location'])
    skills = pd.read_csv(skills_path) if os.path.exists(skills_path) else pd.DataFrame(columns=['person_id', 'skill'])
    
    return people, abilities, education, experience, skills

# Process resume data and generate embeddings
def process_resume(person_id, people, abilities, education, experience, skills):
    # Get person data
    person = people[people['person_id'] == person_id].iloc[0] if not people[people['person_id'] == person_id].empty else None
    if person is None:
        return None
    
    # Collect all person abilities
    person_abilities = abilities[abilities['person_id'] == person_id]['ability'].tolist()
    
    # Collect education information
    person_education = education[education['person_id'] == person_id].to_dict('records')
    
    # Collect work experience
    person_experience = experience[experience['person_id'] == person_id].to_dict('records')
    
    # Collect skills
    person_skills = skills[skills['person_id'] == person_id]['skill'].tolist()
    
    # Create a text representation of the resume
    resume_text = f"Name: {person['name']}\n"
    if not pd.isna(person['email']):
        resume_text += f"Email: {person['email']}\n"
    if not pd.isna(person['phone']):
        resume_text += f"Phone: {person['phone']}\n"
    if not pd.isna(person['linkedin']):
        resume_text += f"LinkedIn: {person['linkedin']}\n"
    
    resume_text += "\nSkills:\n"
    for skill in person_skills:
        resume_text += f"- {skill}\n"
    
    resume_text += "\nAbilities:\n"
    for ability in person_abilities:
        resume_text += f"- {ability}\n"
    
    resume_text += "\nEducation:\n"
    for edu in person_education:
        edu_line = ""
        if not pd.isna(edu.get('program')):
            edu_line += f"{edu['program']}"
        if not pd.isna(edu.get('institution')):
            if edu_line:
                edu_line += f" at {edu['institution']}"
            else:
                edu_line += f"{edu['institution']}"
        if not pd.isna(edu.get('location')):
            edu_line += f", {edu['location']}"
        if not pd.isna(edu.get('start_date')):
            edu_line += f" ({edu['start_date']})"
        resume_text += f"- {edu_line}\n"
    
    resume_text += "\nExperience:\n"
    for exp in person_experience:
        exp_line = ""
        if not pd.isna(exp.get('title')):
            exp_line += f"{exp['title']}"
        if not pd.isna(exp.get('firm')):
            if exp_line:
                exp_line += f" at {exp['firm']}"
            else:
                exp_line += f"{exp['firm']}"
        if not pd.isna(exp.get('location')):
            exp_line += f", {exp['location']}"
        
        date_range = ""
        if not pd.isna(exp.get('start_date')):
            date_range += f"{exp['start_date']}"
        if not pd.isna(exp.get('end_date')):
            if date_range:
                date_range += f" - {exp['end_date']}"
            else:
                date_range += f"{exp['end_date']}"
        if date_range:
            exp_line += f" ({date_range})"
        
        resume_text += f"- {exp_line}\n"
    
    return resume_text

# Calculate features based on JobBERT embeddings (simulated)
def calculate_features(resume_text, job_description):
    # Get embeddings for resume and job description
    resume_embedding = get_embeddings(resume_text)
    job_embedding = get_embeddings(job_description)
    
    # Calculate cosine similarity
    similarity = np.dot(resume_embedding, job_embedding) / (np.linalg.norm(resume_embedding) * np.linalg.norm(job_embedding))
    
    # Extract additional features (in a real implementation, more features would be used)
    features = np.append(resume_embedding, [similarity])
    
    return features

# Score a candidate resume against a job description
def score_candidate(resume_text, job_description):
    # Calculate features
    features = calculate_features(resume_text, job_description)
    
    # In a real implementation, we would use the trained model to predict
    # For this demo, we'll use similarity as the main score
    similarity = features[-1]  # Last feature is similarity
    
    # Generate a score from 0 to 100
    score = min(100, max(0, similarity * 100))
    
    # For demonstration purposes, add some randomness to show different scores
    score = score * 0.7 + np.random.uniform(50, 95) * 0.3
    
    return round(score, 1)

@app.route('/api/screen-resumes', methods=['POST'])
def screen_resumes():
    data = request.get_json()
    job_description = data.get('jobDescription', '')
    job_title = data.get('jobTitle', '')
    
    # Combine job title and description
    full_job_description = f"{job_title}\n\n{job_description}"
    
    # Load resume data
    people, abilities, education, experience, skills = load_resume_data()
    
    # Process resumes and score them
    results = []
    for index, person in people.iterrows():
        person_id = person['person_id']
        resume_text = process_resume(person_id, people, abilities, education, experience, skills)
        
        if resume_text:
            score = score_candidate(resume_text, full_job_description)
            
            # Create result object
            results.append({
                'person_id': int(person_id),
                'name': person['name'],
                'email': person['email'] if not pd.isna(person['email']) else '',
                'phone': person['phone'] if not pd.isna(person['phone']) else '',
                'linkedin': person['linkedin'] if not pd.isna(person['linkedin']) else '',
                'score': score
            })
    
    # Sort results by score (descending)
    sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)
    
    # Return top 50 results
    return jsonify({
        'results': sorted_results[:50]
    })

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello from Flask!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
