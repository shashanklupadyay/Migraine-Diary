                                                 🧠 Project: Migraine Tracker & Manager

🌟 Introduction

Welcome to the Migraine Tracker & Manager, a project dedicated to helping individuals understand and manage their migraine attacks. This application provides a simple, intuitive interface for logging symptoms, triggers, and treatments. By visualizing your data over time, you can gain valuable insights, identify patterns, and better communicate with your healthcare provider. Take control of your health with data-driven insights!

✨ Core Features
Symptom & Trigger Logging: Easily log the intensity, duration, and specific symptoms of an attack, along with potential triggers like stress, diet, or weather changes.

Treatment Effectiveness Tracking: Record the medications or treatments you use and track their effectiveness to find what works best for you.

Interactive Data Visualization: View your data in charts and graphs to identify trends, frequency, and severity patterns over time.

Customizable Reporting: Generate personalized reports that you can easily share with your doctor to facilitate more informed discussions.

Data Export: Securely export your data in a simple format for personal backup or detailed analysis.

🚀 Getting Started
Follow these steps to get the migraine app up and running on your local machine.

Prerequisites
You will need the following software installed:

Node.js (for the backend)

npm (Node Package Manager)

A code editor (e.g., VS Code)

Installation
Clone the repository:

git clone https://github.com/your-username/your-migraine-app.git
cd your-migraine-app

Install the required dependencies (separately for each app):

cd backend
npm install

cd ../frontend
npm install

Set up environment variables:
1. Copy `.env.example` to `.env` for the backend (or copy these values into `backend/.env`).
2. Create `frontend/.env` and set at least `VITE_API_BASE_URL` (frontend API base URL).

🎮 How to Run
Once the project is set up, you can start the application.

Running the App
To start the local development server:

In one terminal:
cd backend
npm run dev

In a second terminal:
cd frontend
npm run dev

Default URLs:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5050/diary/migranes

Using the App
Use the UI to create, view, edit, and delete diary entries.

AI Insights:
- Frontend page: `/ai-overview`
- Backend endpoint: `GET /diary/migranes/ai-overview`

📂 Project Structure

- `backend/`: Express API server (MongoDB + Gemini AI)
- `frontend/`: React + Vite UI
- `.env.example`: example env vars (copy into the appropriate places)