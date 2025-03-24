# HireFlow

HireFlow is an advanced Applicant Tracking System (ATS) that leverages machine learning algorithms (JobBERT and XGBoost) to revolutionize the recruitment process. This intelligent system automates resume screening, candidate ranking, and shortlisting, enabling organizations to make data-driven hiring decisions efficiently.

## Project Overview

HireFlow transforms traditional recruitment by offering:

- Automated resume screening and analysis using JobBERT
- AI-powered candidate ranking and scoring
- Smart matching between job requirements and candidate qualifications
- Real-time application processing and evaluation
- Data-driven insights for hiring decisions
- Customizable screening criteria and requirements

## Features

- Job posting management
- Candidate tracking and management
- Interview scheduling
- Application status tracking
- Team collaboration tools
- Analytics and reporting capabilities

## Purpose

The main purpose of HireFlow is to make recruitment processes more efficient and organized, helping organizations find and hire the best talent while reducing time-to-hire and improving the overall recruitment experience for both employers and candidates.

## Tech Stack

- **Frontend:** React, TailwindCSS
- **Backend:** Flask, Supabase
- **Database:** PostgreSQL (Supabase)
- **AI:** Hugging Face Transformers (JobBERT)

## System Architecture

The application is built with modern technologies and follows a robust architecture:

- **Frontend Layer:** React with Tailwind CSS providing an intuitive user interface
- **Backend Processing:** Flask-based API handling business logic and ML operations
- **ML Components:** JobBERT for resume analysis and XGBoost for candidate ranking
- **Database Layer:** PostgreSQL via Supabase for secure data management
- **API Integration:** RESTful endpoints for seamless communication

## Getting Started

Python version: 3.11.9

1. Clone the repository

2. Install dependencies

Frontend

cd frontend

npm install vite

npm install axios

npm install @tanstack/react-query @tanstack/react-query-devtools date-fns

npm install @react-pdf/renderer react-pdf

npm run dev

Backend

cd backend

pip install -r requirements.txt

pip install openai

python -m spacy download en_core_web_sm

python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

python app.py

3. Set up environment variables:

Create .env file in frontend directory
Add Supabase credentials

4. Run the application

Frontend
npm run dev

Backend
python app.py

Contributing
Pull requests are welcome. For major changes, please open an issue first.
