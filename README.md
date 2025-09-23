## Leaad

A full-stack app for Reddit-focused lead discovery, post generation, and product insights.

### Features

- **Lead discovery**: Find subreddits and buyers with intent
- **Post generation**: Create Reddit posts and replies
- **Product analysis**: Summarize product details
- **Auth & rate limits**: Supabase JWT auth, server-side rate limiting

### Tech Stack

- **Frontend**: React 19, Vite, React Router, TanStack Query, Tailwind, MUI, Shadcn
- **Backend**: Flask, flask-smorest, CORS, dotenv
- **Auth/Storage**: Supabase

### Project Structure

```
Backend/           # Flask API
  app.py
  src/
    routes/       # product, reddit, leads, onboarding
    utils/        # auth, rate limiting, scraping, prompts
Frontend/          # React app (Vite)
  src/
    pages/        # app screens
    components/   # UI and graphics
```

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+

### Environment Variables

Create `Backend/.env` with at least:

```
SUPABASE_URL=...
SUPABASE_JWT_SECRET=...
```

Frontend environment is configured via `src/config/environment.js` and services that call the backend at `http://localhost:5000` during development.

### Setup

Install dependencies for both apps:

```
cd Backend
pip install -r requirements.txt

cd ../Frontend
npm install
```

### Development

Run the backend (Flask):

```
cd Backend
python app.py
```

The API serves on `http://localhost:5000` with routes like `/health` and protected endpoints under JWT.

Run the frontend (Vite):

```
cd Frontend
npm run dev
```

The app is available at `http://localhost:5173`.

### Build & Preview (Frontend)

```
cd Frontend
npm run build
npm run preview
```

### Basic API

- `GET /health`: health check
- `GET /protected`: requires valid Supabase JWT

### License

MIT, Check License
