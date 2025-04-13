from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import fitz  # PyMuPDF
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure CORS with complete unrestricted access
app.config['CORS_HEADERS'] = '*'
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": "*",
        "expose_headers": "*"
    }
}, supports_credentials=False)

@app.after_request
def after_request(response):
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400'
    })
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
@app.route('/api/evaluate', methods=['POST', 'OPTIONS'])
def evaluate():
    # Handle OPTIONS request
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': '*'
        })
        return response

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
