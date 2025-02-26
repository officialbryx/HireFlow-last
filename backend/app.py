from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from transformers import pipeline
import logging

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

# Load Hugging Face LLM
model = pipeline("summarization", model="facebook/bart-large-cnn")

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

if __name__ == "__main__":
    app.run(debug=True)
