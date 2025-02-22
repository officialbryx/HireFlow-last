from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from transformers import pipeline
from werkzeug.security import generate_password_hash, check_password_hash
import jwt  # Change this line to use direct import
import datetime
import logging

logging.basicConfig(level=logging.DEBUG)

# Initialize Flask App
app = Flask(__name__)
# Configure CORS to accept requests from frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Connect to MySQL Database
# Change password as needed
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="hireflow"
)
cursor = db.cursor()

# Load Hugging Face LLM (Example: Summarization Model)
model = pipeline("summarization", model="facebook/bart-large-cnn")

# JWT Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this to a secure secret key

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

@app.route("/api/auth/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return "", 200
        
    try:
        data = request.json
        logging.debug(f"Login attempt for email: {data.get('email')}")
        
        cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
        columns = [col[0] for col in cursor.description]
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        user_dict = dict(zip(columns, user))
        
        if check_password_hash(user_dict['password'], data['password']):
            payload = {
                'user_id': user_dict['id'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }
            token = jwt.encode(
                payload,
                app.config['SECRET_KEY'],
                algorithm='HS256'
            )
            
            # Convert token to string if it's bytes
            if isinstance(token, bytes):
                token = token.decode('utf-8')
            
            return jsonify({
                "token": token,
                "user": {
                    "id": user_dict['id'],
                    "email": user_dict['email'],
                    "firstName": user_dict['first_name'],
                    "lastName": user_dict['last_name'],
                    "userType": user_dict['user_type']
                }
            })
        
        return jsonify({"error": "Invalid password"}), 401
        
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({"error": "An error occurred during login"}), 500

if __name__ == "__main__":
    app.run(debug=True)
