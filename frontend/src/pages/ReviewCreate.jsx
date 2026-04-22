import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../api/books";
import { createReview } from "../api/reviews";
import { PageHeader } from "../components/PageHeader";

export function ReviewCreate() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [bookId, setBookId] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadBooks() {
      const response = await getBooks(1, 100);
      setBooks(response.data.items);
    }

    loadBooks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!bookId || !content.trim()) {
      return;
    }

    await createReview({
      book_id: Number(bookId),
      content,
    });

    navigate("/reviews");
  };

  return (
    <>
      <PageHeader title="Reviews > Create" />

      <div className="panel">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="book">Book</label>
            <select
              id="book"
              value={bookId}
              onChange={(event) => setBookId(event.target.value)}
            >
              <option value="">Select book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
            {submitted && !bookId && (
              <span className="error-text">* Please select book</span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="review">Review</label>
            <textarea
              id="review"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            {submitted && !content.trim() && (
              <span className="error-text">* Please enter review</span>
            )}
          </div>

          <button className="primary-button" type="submit">
            Create
          </button>
        </form>
      </div>
    </>
  );
}
