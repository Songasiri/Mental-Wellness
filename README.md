# Mental Wellness Chatbot for Students using NLP

## Overview

This project aims to support student mental health through an AI-powered chatbot that uses Natural Language Processing (NLP) to detect emotions, provide empathetic responses, and recommend wellness activities. It offers real-time assistance, mood-based music suggestions, and emergency alerts for critical situations.


## Features

The chatbot is developed to:

1. Provide real-time emotional support through text and voice input.

2. Offer empathetic responses based on sentiment analysis.

3. Recommend mood-based music using the Spotify API.

4. Trigger emergency email alerts via Nodemailer when distress signals (like suicide keywords) are detected.

5. Operate through a secure and scalable platform built using MERN Stack and FastAPI.


## Tech Stack

Frontend: React.js (MERN)

Backend: FastAPI (Python)

Database: MongoDB

APIs Used:

Spotify API – Mood-based music recommendations

Gemini API – Sentiment analysis

Nodemailer – Emergency email notifications


## Modules

User Interaction Module – Chat interface (text & voice)

NLP Module – Emotional analysis and mood detection

Music Recommendation Module – Fetches music from Spotify

Emergency Alert Module – Sends alerts to guardians in crises


## Setup Instructions

### Frontend

cd frontend
npm i
npm run dev

### Backend
cd backend
npm i
npm start

### nlp
cd nlp
Set Up a Virtual Environment: python -m venv venv

Install Dependencies: pip install -r requirements.txt
.\venv\Scripts\activate
pip install -r requirements.txt
pip install uvicorn

Run the application: uvicorn app:app --reload


## Team
Shiek Rajiya

Tirumalasetti Suvarna Lakshmi Kalyani

Thatti Tejasri 

Pasumarti Kriti Meher

Songa Siri

### Guide: Dr. Raja Rao PBV, Associate Professor

