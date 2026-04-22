from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Author, Book
from app.schemas import BookCreate, BookUpdate

router = APIRouter()


@router.get("")
def list_books(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    total = db.scalar(select(func.count(Book.id)))
    stmt = (
        select(Book, Author.name)
        .join(Author)
        .order_by(Book.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    rows = db.execute(stmt).all()

    return {
        "items": [
            {
                "id": book.id,
                "title": book.title,
                "author_id": book.author_id,
                "author_name": author_name,
            }
            for book, author_name in rows
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("")
def create_book(payload: BookCreate, db: Session = Depends(get_db)):
    author = db.get(Author, payload.author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    book = Book(title=payload.title.strip(), author_id=payload.author_id)
    db.add(book)
    db.commit()
    db.refresh(book)
    return {
        "id": book.id,
        "title": book.title,
        "author_id": book.author_id,
        "author_name": author.name,
    }


@router.put("/{book_id}")
def update_book(book_id: int, payload: BookUpdate, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    author = db.get(Author, payload.author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    book.title = payload.title.strip()
    book.author_id = payload.author_id
    db.commit()
    db.refresh(book)

    return {
        "id": book.id,
        "title": book.title,
        "author_id": book.author_id,
        "author_name": author.name,
    }


@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    db.delete(book)
    db.commit()
    return {"message": "Book deleted"}
