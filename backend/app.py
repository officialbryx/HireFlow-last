from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz  # PyMuPDF
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)
# Configure CORS for production frontend and API
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://hireflow-web.onrender.com",
            "https://hireflow-backend-obv1.onrender.com"
        ],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Range", "X-Total-Count"],
        "supports_credentials": True,
        "max_age": 120  # Cache preflight requests
    }
})

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.after_request
def add_security_headers(response):
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

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
                
                # Get AI analysis results
                try:
                    ai_results = analyze_with_ai(
                        job_post=job_post,
                        resume_text=text
                    )
                except Exception as e:
                    raise Exception(f"Error in AI analysis: {str(e)}")

                # Clean up and return response
                os.remove(filepath)
                
                # Extract scores from AI results
                match_scores = ai_results.get('match_scores', {})
                overall_match = match_scores.get('overall_match', 0)
                skills_match = match_scores.get('skills_match', 0)
                qualified = match_scores.get('qualified', False)

                # Return structured response
                return jsonify({
                    'ai_insights': {
                        'sections': ai_results.get('sections', {}),
                        'match_scores': ai_results.get('match_scores', {})
                    },
                    'technical_analysis': ai_results.get('technical_analysis', {}),
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
    port = int(os.environ.get('PORT', 10000))  # Changed default from 5000 to 10000
    app.config['TIMEOUT'] = 120
    # Enable production settings
    app.run(
        host='0.0.0.0',  # Allow external connections
        port=port,
        debug=False      # Disable debug in production
    )
