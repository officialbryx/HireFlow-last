from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from transformers import pipeline
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

# Initialize Flask App
app = Flask(__name__)
# Configure CORS to accept requests from frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Connect to MySQL Database
# Change password as needed
# password="admin",
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="admin",
    database="hireflow"
)
cursor = db.cursor()

# Load Hugging Face LLM (Example: Summarization Model)
model = pipeline("summarization", model="facebook/bart-large-cnn")

# JWT Configuration
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key

@app.route("/")  
def home():
    return jsonify({"message": "Welcome to HireFlow API!"})

@app.route("/api/analyze-resume", methods=["POST"])
def analyze_resume():
    data = request.json
    resume_text = data.get("resume_text")
    
    if not resume_text:
        return jsonify({"error": "No resume text provided"}), 400

    summary = model(resume_text, max_length=150, min_length=50, do_sample=False)
    return jsonify({"summary": summary[0]["summary_text"]})

@app.route("/api/applicants", methods=["GET"])
def get_applicants():
    cursor.execute("SELECT * FROM applicants")
    applicants = cursor.fetchall()
    return jsonify({"applicants": applicants})

# ============================== AUTHENTICATION ============================== #
@app.route("/api/auth/signup", methods=["POST"])
def signup():
    data = request.json
    
    # Check if user already exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    if cursor.fetchone():
        return jsonify({"error": "Email already registered"}), 409
    
    # Hash password
    hashed_password = generate_password_hash(data['password'])
    
    try:
        cursor.execute(
            "INSERT INTO users (first_name, last_name, email, password, user_type) VALUES (%s, %s, %s, %s, %s)",
            (data['firstName'], data['lastName'], data['email'], hashed_password, data['userType'])
        )
        db.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json
    
    cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    user = cursor.fetchone()
    
    if user and check_password_hash(user[4], data['password']):  # Index 4 is password
        token = jwt.encode({
            'user_id': user[0],  # Index 0 is user_id
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        
        return jsonify({
            "token": token,
            "user": {
                "id": user[0],
                "email": user[3],
                "firstName": user[1],
                "lastName": user[2],
                "userType": user[5]
            }
        })
    
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/api/job-postings", methods=["GET"])
def get_all_jobs():
    cursor.execute("SELECT * FROM job_posting")
    jobs = cursor.fetchall()

    job_list = []
    for job in jobs:
        job_list.append({
            "id": job[0],
            "job_title": job[1],  
            "company_name": job[2],  
            "location": job[3],  
            "employment_type": job[4],  
            "salary_range": job[5],  
            "applicants_needed": job[6],  
            "company_logo_url": job[7],  
            "company_description": job[8],  
            "about_company": job[9],  
            "created_at": job[10]  
        })
    
    return jsonify({"jobs": job_list})

@app.route("/api/job-postings/<int:job_id>", methods=["GET"])
def get_job(job_id):
    cursor.execute("SELECT * FROM job_posting WHERE id = %s", (job_id,))
    job = cursor.fetchone()

    if not job:
        return jsonify({"error": "Job not found"}), 404

    return jsonify({
        "id": job[0],
        "job_title": job[1],
        "company_name": job[2],
        "location": job[3],
        "employment_type": job[4],
        "salary_range": job[5],
        "applicants_needed": job[6],
        "company_logo_url": job[7],
        "company_description": job[8],
        "about_company": job[9],
        "created_at": job[10]
    })

@app.route("/api/job-postings", methods=["POST"])
def create_job():
    data = request.json
    try:
        cursor.execute(
            """
            INSERT INTO job_posting 
            (job_title, company_name, location, employment_type, salary_range, applicants_needed, 
            company_logo_url, company_description, about_company, created_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            """,
            (
                data["job_title"], data["company_name"], data["location"], data["employment_type"], 
                data["salary_range"], data["applicants_needed"], data["company_logo_url"], 
                data["company_description"], data["about_company"]
            )
        )
        db.commit()
        job_id = cursor.lastrowid  # Get the inserted job ID
        return jsonify({"message": "Job created successfully", "job_id": job_id}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400

# ============================== JOB RESPONSIBILITIES CRUD ============================== #
@app.route("/api/job-postings/<int:job_id>/responsibilities", methods=["GET"])
def get_job_responsibilities(job_id):
    cursor.execute("SELECT responsibility FROM job_responsibility WHERE job_posting_id = %s", (job_id,))
    responsibilities = [row[0] for row in cursor.fetchall()]
    return jsonify({"responsibilities": responsibilities})

@app.route("/api/job-postings/<int:job_id>/responsibilities", methods=["POST"])
def add_job_responsibility(job_id):
    data = request.json
    try:
        for responsibility in data["responsibilities"]:
            cursor.execute("INSERT INTO job_responsibility (job_posting_id, responsibility) VALUES (%s, %s)", (job_id, responsibility))
        db.commit()
        return jsonify({"message": "Responsibilities added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ============================== JOB QUALIFICATIONS CRUD ============================== #
@app.route("/api/job-postings/<int:job_id>/qualifications", methods=["GET"])
def get_job_qualifications(job_id):
    cursor.execute("SELECT qualification FROM job_qualification WHERE job_posting_id = %s", (job_id,))
    qualifications = [row[0] for row in cursor.fetchall()]
    return jsonify({"qualifications": qualifications})

@app.route("/api/job-postings/<int:job_id>/qualifications", methods=["POST"])
def add_job_qualification(job_id):
    data = request.json
    try:
        for qualification in data["qualifications"]:
            cursor.execute("INSERT INTO job_qualification (job_posting_id, qualification) VALUES (%s, %s)", (job_id, qualification))
        db.commit()
        return jsonify({"message": "Qualifications added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# ============================== JOB SKILLS CRUD ============================== #
@app.route("/api/job-postings/<int:job_id>/skills", methods=["GET"])
def get_job_skills(job_id):
    cursor.execute("SELECT skill FROM job_skills WHERE job_posting_id = %s", (job_id,))
    skills = [row[0] for row in cursor.fetchall()]
    return jsonify({"skills": skills})

@app.route("/api/job-postings/<int:job_id>/skills", methods=["POST"])
def add_job_skills(job_id):
    data = request.json
    try:
        for skill in data["skills"]:
            cursor.execute("INSERT INTO job_skills (job_posting_id, skill) VALUES (%s, %s)", (job_id, skill))
        db.commit()
        return jsonify({"message": "Skills added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
