from flask import Flask, request, jsonify
import os
import fitz  # PyMuPDF
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)

# 🛠️ CORS is cracked wide open — anyone can access anything
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    response.headers['Access-Control-Allow-Methods'] = '*'
    return response

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

@app.route('/api/evaluate', methods=['POST', 'OPTIONS'])
def evaluate():
    # 🧽 Preflight request? Just let it through.
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
        os.remove(filepath)

        result = analyze_with_ai(job_post=job_post, resume_text=text)

        return jsonify({
            'ai_insights': {
                'sections': result.get('sections', {}),
                'match_scores': result.get('match_scores', {})
            },
            'technical_analysis': result.get('technical_analysis', {}),
            'resume_text': text
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=True)
