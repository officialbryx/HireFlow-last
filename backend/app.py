from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz  # PyMuPDF
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure CORS to allow everything
CORS(app, 
     resources={r"/*": {
         "origins": "*",
         "methods": ["GET", "POST", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
         "supports_credentials": True,
         "max_age": 3600
     }})

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/evaluate', methods=['POST', 'OPTIONS'])
def evaluate():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
        
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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)