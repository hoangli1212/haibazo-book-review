import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAuthor } from "../api/authors";
import { PageHeader } from "../components/PageHeader";

export function AuthorCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!name.trim()) {
      return;
    }

    await createAuthor({ name });
    navigate("/authors");
  };

  return (
    <>
      <PageHeader title="Authors > Create" />

      <div className="panel">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            {submitted && !name.trim() && (
              <span className="error-text">* Please enter name</span>
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
