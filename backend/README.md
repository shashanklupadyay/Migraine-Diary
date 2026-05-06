# Backend (Express + MongoDB + Gemini AI)

## Prerequisites

- Node.js 18+
- MongoDB (URI in `MONGO_URI`)
- Gemini API key (`GEMINI_API_KEY`)
- Upstash Redis credentials for rate limiting

## Environment variables

Copy the root example env file into `backend/.env` (preferred) or ensure your `.env` is available in the working directory when starting the server:

- `PORT` (default: `5050`)
- `MONGO_URI`
- `GEMINI_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `CLIENT_ORIGIN` (frontend origin for CORS, default `http://localhost:5173`)

## Scripts

- `npm run dev` (nodemon)
- `npm run start` (node server.js)

## API routes

All routes are under:

- `/diary/migranes`

Endpoints:

- `GET /` (list entries)
- `GET /:id` (get entry by id)
- `POST /new` (create entry)
- `PUT /update/:id` (update entry)
- `DELETE /delete/:id` (delete entry)
- `GET /ai-overview` (generate AI overview)

