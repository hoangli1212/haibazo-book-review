from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Author, Book
from app.schemas import AuthorCreate, AuthorUpdate

router = APIRouter()


@router.get("")
def list_authors(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    total = db.scalar(select(func.count(Author.id)))
    stmt = (
        select(Author, func.count(Book.id).label("books_count"))
        .outerjoin(Book)
        .group_by(Author.id)
        .order_by(Author.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    rows = db.execute(stmt).all()

    return {
        "items": [
            {"id": author.id, "name": author.name, "books_count": books_count}
            for author, books_count in rows
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("")
def create_author(payload: AuthorCreate, db: Session = Depends(get_db)):
    author = Author(name=payload.name.strip())
    db.add(author)
    db.commit()
    db.refresh(author)
    return {"id": author.id, "name": author.name, "books_count": 0}


@router.put("/{author_id}")
def update_author(author_id: int, payload: AuthorUpdate, db: Session = Depends(get_db)):
    author = db.get(Author, author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    author.name = payload.name.strip()
    db.commit()
    db.refresh(author)
    return {"id": author.id, "name": author.name}


@router.delete("/{author_id}")
def delete_author(author_id: int, db: Session = Depends(get_db)):
    author = db.get(Author, author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    db.delete(author)
    db.commit()
    return {"message": "Author deleted"}
