from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import io
import fitz  # PyMuPDF
from main import analyze_job_requirements, perform_resume_analysis, compare_requirements
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        job_post = request.form.get('jobPost')
        
        if not job_post:
            return jsonify({'error': 'No job post provided'}), 400
            
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            try:
                # Extract text from PDF
                doc = fitz.open(filepath)
                text = ""
                for page in doc:
                    text += page.get_text()
                doc.close()
                
                # Analyze job post and resume with enhanced skill extraction
                job_requirements = analyze_job_requirements(job_post)
                resume_analysis = perform_resume_analysis(text)
                comparison = compare_requirements(job_requirements, resume_analysis)
                
                # Clean up the uploaded file
                os.remove(filepath)
                
                # Include semantic similarity scores in response
                return jsonify({
                    'job_analysis': job_requirements,
                    'resume_analysis': resume_analysis,
                    'comparison': comparison,
                    'console_output': {
                        'skills': resume_analysis['skills'],
                        'education': resume_analysis['education'],
                        'experience': resume_analysis['experience'],
                        'personal_info': resume_analysis['personal_info'],
                        'certifications': resume_analysis['certifications'],
                        'semantic_matches': {
                            skill: score for skill, score in 
                            comparison.get('semantic_scores', {}).items()
                        }
                    },
                    'resume_text': text
                })
            except Exception as e:
                # Clean up file in case of error
                if os.path.exists(filepath):
                    os.remove(filepath)
                raise e
            
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
