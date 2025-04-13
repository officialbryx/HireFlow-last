from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import fitz
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure CORS to be as permissive as possible
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": ["https://hireflow-web.onrender.com", "http://localhost:3000"],
        "methods": ["OPTIONS", "GET", "POST"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.after_request
def after_request(response):
    response.headers.update({
        'Access-Control-Allow-Origin': 'https://hireflow-web.onrender.com',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '3600'
    })
    return response

# Basic setup
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['POST', 'OPTIONS'])
def evaluate():
    # Handle preflight request
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.update({
            'Access-Control-Allow-Origin': 'https://hireflow-web.onrender.com',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        })
        return response

    try:
        # Handle POST request
        if not request.files or 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400

        file = request.files['resume']
        job_post = request.form.get('jobPost')

        if not job_post:
            return jsonify({'error': 'No job post provided'}), 400

        if file:
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

                # Analyze with AI
                ai_results = analyze_with_ai(job_post=job_post, resume_text=text)

                # Clean up file
                if os.path.exists(filepath):
                    os.remove(filepath)

                # Create response with explicit headers
                response = make_response(jsonify({
                    'ai_insights': {
                        'sections': ai_results.get('sections', {}),
                        'match_scores': ai_results.get('match_scores', {})
                    },
                    'technical_analysis': ai_results.get('technical_analysis', {}),
                    'resume_text': text
                }))

                response.headers.update({
                    'Access-Control-Allow-Origin': 'https://hireflow-web.onrender.com',
                    'Content-Type': 'application/json'
                })
                return response

            except Exception as e:
                if os.path.exists(filepath):
                    os.remove(filepath)
                return jsonify({'error': f"Processing error: {str(e)}"}), 500

        return jsonify({'error': 'Invalid file'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    # Enable debug mode and increase timeout
    app.config['TIMEOUT'] = 300  # 5 minutes timeout
    app.run(host="0.0.0.0", port=port, debug=True)
