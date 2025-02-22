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

if __name__ == "__main__":
    app.run(debug=True)
