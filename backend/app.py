from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import io
import fitz  # PyMuPDF
from main import analyze_job_requirements, perform_resume_analysis, compare_requirements
from aianalysis import analyze_with_ai
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
                # Extract text from PDF with error handling
                text = ""
                try:
                    doc = fitz.open(filepath)
                    for page in doc:
                        text += page.get_text()
                    doc.close()
                except Exception as e:
                    raise Exception(f"Error reading PDF: {str(e)}")

                if not text.strip():
                    raise Exception("No text could be extracted from the PDF")
                
                # Perform analysis with error handling
                try:
                    job_requirements = analyze_job_requirements(job_post)
                    resume_analysis = perform_resume_analysis(text)
                    comparison = compare_requirements(job_requirements, resume_analysis)
                except Exception as e:
                    raise Exception(f"Error in analysis: {str(e)}")

                # Get AI insights with error handling
                try:
                    analysis_results = {
                        'job_analysis': job_requirements,
                        'resume_analysis': resume_analysis,
                        'comparison': comparison
                    }
                    
                    ai_insights = analyze_with_ai(
                        job_post=job_post,
                        resume_text=text,
                        analysis_results=analysis_results
                    )
                except Exception as e:
                    raise Exception(f"Error in AI analysis: {str(e)}")

                # Clean up and return response
                os.remove(filepath)
                
                # Ensure we have valid match scores
                match_scores = ai_insights.get('match_scores', {})
                overall_match = match_scores.get('overall_match', 0)
                skills_match = match_scores.get('skills_match', 0)
                qualified = match_scores.get('qualified', False)

                # Combine and return response
                return jsonify({
                    'job_analysis': job_requirements,
                    'resume_analysis': resume_analysis,
                    'comparison': {
                        'skill_match': {
                            'match_percentage': skills_match,
                            'missing': comparison['skill_match']['missing']
                        },
                        'overall_match': {
                            'score': overall_match,
                            'qualified': qualified
                        }
                    },
                    'ai_insights': {
                        'sections': ai_insights.get('sections', {}),
                        'match_scores': ai_insights.get('match_scores', {})
                    },
                    'technical_analysis': ai_insights.get('technical_analysis', {}),
                    'console_output': {
                        'skills': resume_analysis.get('skills', {}),
                        'education': resume_analysis.get('education', {}),
                        'experience': resume_analysis.get('experience', {}),
                        'personal_info': resume_analysis.get('personal_info', {}),
                        'certifications': resume_analysis.get('certifications', [])
                    },
                    'resume_text': text
                })
                
            except Exception as e:
                if os.path.exists(filepath):
                    os.remove(filepath)
                raise Exception(f"Processing error: {str(e)}")
            
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed',
            'message': 'An error occurred during processing'
        }), 500

if __name__ == '__main__':
    app.config['TIMEOUT'] = 120  # Set server timeout to 2 minutes
    app.run(debug=True, port=5000)
