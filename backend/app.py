from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import fitz  # PyMuPDF
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.before_request
def log_request_info():
    if request.method != 'OPTIONS':  # Don't log OPTIONS requests
        print("Headers:", request.headers)
        if not request.is_json:  # Only log non-JSON requests
            print("Body:", request.get_data()[:1000], "...")  # Truncate long bodies

@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({'error': 'File too large. Maximum size is 16MB'}), 413

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        if not file.filename:
            return jsonify({'error': 'No file selected'}), 400
            
        job_post = request.form.get('jobPost')
        if not job_post:
            return jsonify({'error': 'No job post provided'}), 400
            
        if file and allowed_file(file.filename):
            try:
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                try:
                    text = ""
                    doc = fitz.open(filepath)
                    for page in doc:
                        text += page.get_text()
                    doc.close()

                    if not text.strip():
                        raise Exception("No text could be extracted from the PDF")

                    ai_results = analyze_with_ai(
                        job_post=job_post,
                        resume_text=text
                    )

                    # Clean up and return response
                    if os.path.exists(filepath):
                        os.remove(filepath)
                    
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
                
            except Exception as e:
                if os.path.exists(filepath):
                    os.remove(filepath)
                raise Exception(f"File handling error: {str(e)}")
            
        return jsonify({'error': 'Invalid file type'}), 400
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed',
            'message': 'An error occurred during processing'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=False,
        threaded=True,
        request_timeout=300  # 5 minute timeout
    )
