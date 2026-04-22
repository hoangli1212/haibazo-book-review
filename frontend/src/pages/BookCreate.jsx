import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthors } from "../api/authors";
import { createBook } from "../api/books";
import { PageHeader } from "../components/PageHeader";

export function BookCreate() {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadAuthors() {
      const response = await getAuthors(1, 100);
      setAuthors(response.data.items);
    }

    loadAuthors();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!title.trim() || !authorId) {
      return;
    }

    await createBook({
      title,
      author_id: Number(authorId),
    });

    navigate("/books");
  };

  return (
    <>
      <PageHeader title="Books > Create" />

      <div className="panel">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            {submitted && !title.trim() && (
              <span className="error-text">* Please enter title</span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="author">Author</label>
            <select
              id="author"
              value={authorId}
              onChange={(event) => setAuthorId(event.target.value)}
            >
              <option value="">Select author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
            {submitted && !authorId && (
              <span className="error-text">* Please select author</span>
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
