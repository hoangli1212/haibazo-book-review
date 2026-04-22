# HAIBAZO Book Review

Full-stack book review management app built with React/Vite, FastAPI, PostgreSQL, SQLAlchemy, and Alembic.

## Features

- Manage authors: list, create, update, delete.
- Manage books: list, create, update, delete.
- Manage reviews: list, create, update, delete.
- Server-side pagination with newest records shown first.
- Modal confirmations for destructive actions.
- React Router based dashboard UI.
- FastAPI Swagger docs at `/docs`.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Lucide React

### Backend

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Pydantic Settings
- Uvicorn

## Project Structure

```text
haibazo-book-review/
+-- backend/
|   +-- alembic/
|   +-- app/
|   |   +-- routers/
|   |   +-- config.py
|   |   +-- database.py
|   |   +-- main.py
|   |   +-- models.py
|   |   +-- schemas.py
|   +-- alembic.ini
|   +-- requirements.txt
+-- frontend/
|   +-- public/
|   +-- src/
|   |   +-- api/
|   |   +-- components/
|   |   +-- pages/
|   +-- package.json
|   +-- vercel.json
+-- README.md
```

## Environment Variables

### Backend

Create `backend/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
FRONTEND_ORIGIN=http://localhost:5173
```

The app automatically converts Render-style PostgreSQL URLs from `postgresql://...` to `postgresql+psycopg://...`.

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

For production, set this to the deployed backend URL, for example:

```env
VITE_API_URL=https://haibazo-book-review.onrender.com
```

## Run Locally

### 1. Backend Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

Create the backend `.env` file, then run migrations:

```powershell
alembic upgrade head
```

Start the API:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open:

```text
http://127.0.0.1:8000
http://127.0.0.1:8000/docs
```

### 2. Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## API Routes

### Authors

```text
GET    /api/authors
POST   /api/authors
PUT    /api/authors/{author_id}
DELETE /api/authors/{author_id}
```

### Books

```text
GET    /api/books
POST   /api/books
PUT    /api/books/{book_id}
DELETE /api/books/{book_id}
```

### Reviews

```text
GET    /api/reviews
POST   /api/reviews
PUT    /api/reviews/{review_id}
DELETE /api/reviews/{review_id}
```

List endpoints support pagination:

```text
?page=1&page_size=10
```

## Useful Commands

### Backend

```powershell
cd backend
.\.venv\Scripts\python.exe -m compileall app
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```powershell
cd frontend
npm run lint
npm run build
npm run preview
```

## Deployment

Recommended setup:

- Backend and PostgreSQL on Render.
- Frontend on Vercel.

### Backend on Render

Create a PostgreSQL database on Render, then create a Web Service with:

```text
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Set environment variables:

```text
DATABASE_URL=<Render PostgreSQL URL>
FRONTEND_ORIGIN=https://your-frontend.vercel.app
```

If the frontend has not been deployed yet, temporarily use:

```text
FRONTEND_ORIGIN=http://localhost:5173
```

Update it after Vercel gives you the production frontend URL.

### Frontend on Vercel

Import the repository into Vercel and configure:

```text
Framework Preset: Vite
Root Directory: frontend
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Set environment variable:

```text
VITE_API_URL=https://your-backend.onrender.com
```

After changing `VITE_API_URL`, redeploy the frontend because Vite injects environment variables at build time.

The `frontend/vercel.json` file rewrites all routes to `index.html` so React Router routes work after browser refresh.

## Deployment Troubleshooting

### CORS error on create/update/delete

Set Render backend environment variable exactly to the frontend origin:

```text
FRONTEND_ORIGIN=https://your-frontend.vercel.app
```

Do not include a trailing slash.

### Frontend calls localhost in production

Set Vercel environment variable:

```text
VITE_API_URL=https://your-backend.onrender.com
```

Then redeploy the frontend.

### Database table does not exist

Run migrations:

```powershell
cd backend
alembic upgrade head
```

On Render without Shell access, include migration in the Start Command:

```text
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### `psycopg2` missing

Use a PostgreSQL URL with the `psycopg` driver:

```text
postgresql+psycopg://USER:PASSWORD@HOST:5432/DATABASE
```

The app also normalizes plain `postgresql://...` URLs automatically.

## Notes

- Do not commit `.env` files.
- Create authors before books.
- Create books before reviews.
- New records are sorted to the top of list pages.
