from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Basic setup
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/evaluate', methods=['GET', 'POST', 'OPTIONS'])
def evaluate():
    # Handle any request method
    if request.method == 'OPTIONS':
        # Extremely permissive CORS headers
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '86400',
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

            # Extract text from PDF
            text = ""
            try:
                doc = fitz.open(filepath)
                for page in doc:
                    text += page.get_text()
                doc.close()
            except Exception as e:
                return jsonify({'error': f"Error reading PDF: {str(e)}"}), 500

            # Analyze with AI
            try:
                ai_results = analyze_with_ai(job_post=job_post, resume_text=text)
                
                # Clean up
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
                
                # Add CORS headers to response
                response.headers.add('Access-Control-Allow-Origin', '*')
                response.headers.add('Access-Control-Allow-Headers', '*')
                response.headers.add('Access-Control-Allow-Methods', '*')
                return response

            except Exception as e:
                return jsonify({'error': f"Analysis error: {str(e)}"}), 500

        return jsonify({'error': 'Invalid file'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=True)
