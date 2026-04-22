from pydantic import BaseModel, Field


class AuthorCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class AuthorUpdate(AuthorCreate):
    pass


class AuthorOut(BaseModel):
    id: int
    name: str
    books_count: int = 0


class BookCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    author_id: int


class BookUpdate(BookCreate):
    pass


class BookOut(BaseModel):
    id: int
    title: str
    author_id: int
    author_name: str


class ReviewCreate(BaseModel):
    book_id: int
    content: str = Field(min_length=1)


class ReviewUpdate(ReviewCreate):
    pass


class ReviewOut(BaseModel):
    id: int
    book_id: int
    book_title: str
    author_name: str
    content: str


class PaginatedOut(BaseModel):
    items: list
    total: int
    page: int
    page_size: int
