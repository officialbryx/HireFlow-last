# HireFlow

A professional networking and job search platform built with React, MySQL, Supabase, and Flask.

## Features

- User Authentication (Sign up/Login)
- Professional Profile Management
- News Feed
- Resume Analysis using AI
- Real-time Database with Supabase

## Tech Stack

- **Frontend:** React, TailwindCSS
- **Backend:** Flask, Supabase
- **Database:** PostgreSQL (Supabase)
- **AI:** Hugging Face Transformers (JobBERT)

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

