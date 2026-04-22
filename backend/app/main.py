from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import authors, books, reviews

app = FastAPI(title="HAIBAZO Book Review API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authors.router, prefix="/api/authors", tags=["Authors"])
app.include_router(books.router, prefix="/api/books", tags=["Books"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])

@app.get("/")
def health_check():
    return {"status": "ok"}
