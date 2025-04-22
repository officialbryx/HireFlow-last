from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import fitz  # PyMuPDF
from aianalysis import analyze_with_ai
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

@app.route('/api/evaluate', methods=['POST', 'OPTIONS'])
def evaluate():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', '*')
        return response

    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        job_post = request.form.get('jobPost')
        
        if not job_post:
            return jsonify({'error': 'No job post provided'}), 400
            
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads', filename)
        file.save(filepath)
        
        try:
            text = ""
            doc = fitz.open(filepath)
            for page in doc:
                text += page.get_text()
            doc.close()

            ai_results = analyze_with_ai(
                job_post=job_post,
                resume_text=text
            )

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
            return jsonify({'error': str(e)}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=False)
