from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)
# Enable CORS fully with no restrictions
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,X-Auth-Token')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

@app.route('/api/evaluate', methods=['POST', 'OPTIONS'])
def evaluate():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200
        
    try:
        file = request.files.get('resume')
        job_post = request.form.get('jobPost')

        if not file or not job_post:
            return jsonify({'error': 'Missing resume or job post'}), 400

        filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
        file.save(filepath)

        doc = fitz.open(filepath)
        text = " ".join(page.get_text() for page in doc)
        doc.close()

        os.remove(filepath)  # Clean up immediately

        result = analyze_with_ai(job_post=job_post, resume_text=text)

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a test route to verify CORS is working
@app.route('/test', methods=['GET', 'OPTIONS'])
def test():
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200
    return jsonify({"message": "API is working!"}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=True)
