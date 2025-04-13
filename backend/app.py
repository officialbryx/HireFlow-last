from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import fitz  # PyMuPDF
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure CORS to allow all origins and headers
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
        "supports_credentials": True,
        "send_wildcard": True
    }
})

# Modify existing after_request handler to ensure CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Max-Age', '86400')  # 24 hours
    return response

# Global error handler to return CORS-friendly error responses
@app.errorhandler(Exception)
def handle_exception(e):
    response = jsonify({
        'error': str(e),
        'status': 'failed',
        'message': 'An unexpected error occurred'
    })
    response.status_code = 500
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Global catch-all OPTIONS route for CORS preflight
@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def catch_all_options(path):
    response = jsonify({"success": True})
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Upload folder and allowed file types
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Resume Evaluation Endpoint
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

            # Extract text from PDF
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

            # Analyze with AI
            try:
                ai_results = analyze_with_ai(
                    job_post=job_post,
                    resume_text=text
                )
            except Exception as e:
                raise Exception(f"Error in AI analysis: {str(e)}")

            # Clean up
            os.remove(filepath)

            # Extract match scores
            match_scores = ai_results.get('match_scores', {})
            overall_match = match_scores.get('overall_match', 0)
            skills_match = match_scores.get('skills_match', 0)
            qualified = match_scores.get('qualified', False)

            # Send result
            return jsonify({
                'ai_insights': {
                    'sections': ai_results.get('sections', {}),
                    'match_scores': ai_results.get('match_scores', {})
                },
                'technical_analysis': ai_results.get('technical_analysis', {}),
                'resume_text': text
            })

        return jsonify({'error': 'Invalid file type'}), 400

    except Exception as e:
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        raise e

# Entry point
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
