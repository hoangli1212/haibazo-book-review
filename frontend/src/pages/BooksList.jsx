import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthors } from "../api/authors";
import { deleteBook, getBooks, updateBook } from "../api/books";
import { ConfirmModal } from "../components/ConfirmModal";
import { EditModal } from "../components/EditModal";
import { PageHeader } from "../components/PageHeader";
import { Pagination } from "../components/Pagination";

const PAGE_SIZE = 5;

export function BooksList() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  const loadBooks = async () => {
    const response = await getBooks(page, PAGE_SIZE);
    setBooks(response.data.items);
    setTotal(response.data.total);
  };

  useEffect(() => {
    let active = true;

    getBooks(page, PAGE_SIZE).then((response) => {
      if (!active) {
        return;
      }

      setBooks(response.data.items);
      setTotal(response.data.total);
    });

    return () => {
      active = false;
    };
  }, [page]);

  useEffect(() => {
    let active = true;

    getAuthors(1, 100).then((response) => {
      if (!active) {
        return;
      }

      setAuthors(response.data.items);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleUpdate = async (values) => {
    await updateBook(editingBook.id, {
      title: values.title,
      author_id: Number(values.author_id),
    });
    setEditingBook(null);
    loadBooks();
  };

  const handleDelete = async () => {
    await deleteBook(deletingBook.id);
    setDeletingBook(null);
    loadBooks();
  };

  return (
    <>
      <PageHeader
        title="Books > List"
        action={
          <Link className="primary-button" to="/books/create">
            <Plus size={18} />
            Create
          </Link>
        }
      />

      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book, index) => (
              <tr key={book.id}>
                <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                <td>{book.title}</td>
                <td>{book.author_name}</td>
                <td>
                  <div className="actions">
                    <button
                      className="icon-button"
                      onClick={() => setEditingBook(book)}
                      title="Update"
                      type="button"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      className="icon-button danger"
                      onClick={() => setDeletingBook(book)}
                      title="Delete"
                      type="button"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {books.length === 0 && (
          <div className="empty-state">No books found.</div>
        )}

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onChange={setPage}
        />
      </div>

      {editingBook && (
        <EditModal
          title="Update Book"
          initialValues={{
            title: editingBook.title,
            author_id: editingBook.author_id,
          }}
          fields={[
            {
              name: "title",
              label: "Title",
              required: true,
              errorMessage: "* Please enter title",
            },
            {
              name: "author_id",
              label: "Author",
              type: "select",
              placeholder: "Select author",
              required: true,
              errorMessage: "* Please select author",
              options: authors.map((author) => ({
                value: author.id,
                label: author.name,
              })),
            },
          ]}
          onCancel={() => setEditingBook(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deletingBook && (
        <ConfirmModal
          title="Delete Book"
          message={`Are you sure you want to delete "${deletingBook.title}"?`}
          onCancel={() => setDeletingBook(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
