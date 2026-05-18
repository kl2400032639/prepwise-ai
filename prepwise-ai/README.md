# PrepWise AI - Full Stack AI Mock Interview Platform

PrepWise AI is a complete, production-ready SaaS application for practicing mock interviews using AI. It uses React for the frontend, Node.js + Express for the backend, MongoDB for data storage, and the Google Gemini API for AI question generation and feedback.

## Features
- **Authentication**: JWT-based secure signup and login.
- **Resume Upload**: Upload your PDF resume.
- **AI Question Generation**: Personalized technical & HR questions generated using Gemini based on your resume and selected role.
- **Mock Interview**: Realistic webcam-enabled interview interface.
- **Detailed Feedback**: Get scores (out of 10) on confidence, communication, and technical readiness.

## Setup Instructions

### 1. MongoDB Setup
You need a MongoDB connection string. You can use a local instance (`mongodb://localhost:27017/prepwiseai`) or a free tier MongoDB Atlas cluster.

### 2. Gemini API Key
You need a Google Gemini API Key. Get one for free from Google AI Studio.

### 3. Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Set your environment variables in `backend/.env`:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_uri_here
   JWT_SECRET=supersecretprepwiseai
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the server: `npm start` (Runs on http://localhost:5000)

### 4. Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Ensure the API URL in `frontend/src/api.js` points to your backend.
4. Start the React app: `npm run dev` (Runs on http://localhost:5173)

## Deployment
- **Frontend**: Deployable easily on Vercel (contains `vercel.json` for React Router support).
- **Backend**: Deployable on Render or Railway. Make sure to add the `.env` variables in your hosting provider's dashboard.
