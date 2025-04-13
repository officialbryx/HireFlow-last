from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Basic setup
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['POST', 'OPTIONS'])
def evaluate():
    # Handle OPTIONS request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        }
        return ('', 204, headers)

    try:
        if 'resume' not in request.files:
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
                doc = fitz.open(filepath)
                text = ""
                for page in doc:
                    text += page.get_text()
                doc.close()

                ai_results = analyze_with_ai(job_post=job_post, resume_text=text)
                
                if os.path.exists(filepath):
                    os.remove(filepath)

                response = jsonify({
                    'ai_insights': {
                        'sections': ai_results.get('sections', {}),
                        'match_scores': ai_results.get('match_scores', {})
                    },
                    'technical_analysis': ai_results.get('technical_analysis', {}),
                    'resume_text': text
                })
                
                response.headers.add('Access-Control-Allow-Origin', '*')
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
    app.run(host="0.0.0.0", port=port, debug=True)
