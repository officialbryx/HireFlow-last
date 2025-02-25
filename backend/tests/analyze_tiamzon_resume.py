import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import extract_text_from_pdf, analyze_resume_against_job

def analyze_specific_resume():
    try:
        # Update path to look in test_data folder
        resume_path = os.path.join(os.path.dirname(__file__), 'test_data', 'TIAMZON_Resume.pdf')
        print(f"Looking for resume at: {resume_path}")
        
        # Check if file exists
        if not os.path.exists(resume_path):
            print(f"Error: Resume file not found at {resume_path}")
            return

        print("Opening resume file...")
        with open(resume_path, 'rb') as pdf_file:
            print("Extracting text from PDF...")
            resume_text = extract_text_from_pdf(pdf_file)
            
            if not resume_text:
                print("Error: Failed to extract text from PDF")
                return

            print(f"Successfully extracted {len(resume_text)} characters from PDF")
            print("\nFirst 200 characters of extracted text:")
            print(resume_text[:200])
            
            print("\nAnalyzing resume against job requirements...")
            
            # PDAX job requirements
            job_requirements = """
                Required Technical Skills:
                - Python programming
                - Database systems (SQL, NoSQL)
                - AWS services
                - ETL pipeline development
                - API development
                - Data processing
                
                Experience Requirements:
                - Entry level to 3 years in software development
                - Backend development experience
                - Database management
                - Cloud services
                
                Education:
                - Bachelor's degree in Computer Science or related field
                
                Additional Requirements:
                - Strong problem-solving abilities
                - Team collaboration skills
                - Knowledge of software development best practices
            """

            # Analyze resume
            analysis = analyze_resume_against_job(resume_text, job_requirements)
            
            if not analysis:
                print("Error: Failed to analyze resume")
                return
                
            # Print results
            print("\n====================================")
            print("DETAILED RESUME ANALYSIS REPORT")
            print("====================================")
            print(f"\nCandidate: Bryan Dominick Tiamzon")
            print(f"Position: Junior Python Software Engineer")
            print("\n------------------------------------")
            
            print("\n1. DOCUMENT QUALITY")
            print(f"PDF Scan Quality: {analysis['scan_accuracy']:.1%}")
            print(f"Confidence Score: {analysis['confidence_score']:.1%}")
            
            print("\n2. MATCH SCORES")
            print(f"Overall Match: {analysis['overall_match']:.1%}")
            print(f"Skills Match: {analysis['skills_match']:.1%}")
            print(f"Experience Match: {analysis['experience_match']:.1%}")
            print(f"Education Match: {analysis['education_match']:.1%}")
            
            print("\n3. QUALIFICATION STATUS")
            print(f"Status: {'QUALIFIED' if analysis['qualified'] else 'NOT QUALIFIED'}")
            
            print("\n4. MATCHING SKILLS")
            print("Found skills that match job requirements:")
            for skill in analysis['detailed_analysis']['matching_skills']:
                print(f"✓ {skill}")
            
            print("\n5. MISSING REQUIREMENTS")
            print("Areas for improvement:")
            for req in analysis['detailed_analysis']['missing_requirements']:
                print(f"• {req}")
            
            print("\n6. RECOMMENDATIONS")
            print("Suggested improvements:")
            for sugg in analysis['detailed_analysis']['suggested_improvements']:
                print(f"- {sugg}")
            
            print("\n====================================")
            
    except FileNotFoundError as e:
        print(f"Error: Could not find resume file - {e}")
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print("Full traceback:")
        traceback.print_exc()

if __name__ == "__main__":
    print("Starting resume analysis...")
    analyze_specific_resume()
    print("Analysis complete.")
