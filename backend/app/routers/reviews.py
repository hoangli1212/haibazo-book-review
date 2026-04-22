from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Author, Book, Review
from app.schemas import ReviewCreate, ReviewUpdate

router = APIRouter()


@router.get("")
def list_reviews(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    total = db.scalar(select(func.count(Review.id)))
    stmt = (
        select(Review, Book.title, Author.name)
        .join(Book, Review.book_id == Book.id)
        .join(Author, Book.author_id == Author.id)
        .order_by(Review.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    rows = db.execute(stmt).all()

    return {
        "items": [
            {
                "id": review.id,
                "book_id": review.book_id,
                "book_title": book_title,
                "author_name": author_name,
                "content": review.content,
            }
            for review, book_title, author_name in rows
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("")
def create_review(payload: ReviewCreate, db: Session = Depends(get_db)):
    book = db.get(Book, payload.book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    review = Review(book_id=payload.book_id, content=payload.content.strip())
    db.add(review)
    db.commit()
    db.refresh(review)

    return {"id": review.id, "book_id": review.book_id, "content": review.content}


@router.put("/{review_id}")
def update_review(review_id: int, payload: ReviewUpdate, db: Session = Depends(get_db)):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    book = db.get(Book, payload.book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    review.book_id = payload.book_id
    review.content = payload.content.strip()
    db.commit()
    db.refresh(review)

    return {"id": review.id, "book_id": review.book_id, "content": review.content}


@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}
