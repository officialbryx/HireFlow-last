from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Super simple CORS - allow everything

@app.after_request 
def after_request(response):
    # Accepting all incoming requests
    response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true'
    })
    return response

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

@app.route('/evaluate', methods=['POST', 'OPTIONS'])
def evaluate():
    if request.method == 'OPTIONS':
        return '', 200

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

        response = jsonify({
            'ai_insights': {
                'sections': result.get('sections', {}),
                'match_scores': result.get('match_scores', {})
            },
            'technical_analysis': result.get('technical_analysis', {}),
            'resume_text': text
        })

        return response

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=True)
