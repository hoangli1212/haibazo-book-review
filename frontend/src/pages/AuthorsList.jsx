import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAuthor, getAuthors, updateAuthor } from "../api/authors";
import { ConfirmModal } from "../components/ConfirmModal";
import { EditModal } from "../components/EditModal";
import { PageHeader } from "../components/PageHeader";
import { Pagination } from "../components/Pagination";

const PAGE_SIZE = 5;

export function AuthorsList() {
  const [authors, setAuthors] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [deletingAuthor, setDeletingAuthor] = useState(null);

  const loadAuthors = async () => {
    const response = await getAuthors(page, PAGE_SIZE);
    setAuthors(response.data.items);
    setTotal(response.data.total);
  };

  useEffect(() => {
    let active = true;

    getAuthors(page, PAGE_SIZE).then((response) => {
      if (!active) {
        return;
      }

      setAuthors(response.data.items);
      setTotal(response.data.total);
    });

    return () => {
      active = false;
    };
  }, [page]);

  const handleUpdate = async (values) => {
    await updateAuthor(editingAuthor.id, {
      name: values.name,
    });
    setEditingAuthor(null);
    loadAuthors();
  };

  const handleDelete = async () => {
    await deleteAuthor(deletingAuthor.id);
    setDeletingAuthor(null);
    loadAuthors();
  };

  return (
    <>
      <PageHeader
        title="Authors > List"
        action={
          <Link className="primary-button" to="/authors/create">
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
              <th>Name</th>
              <th>Books</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {authors.map((author, index) => (
              <tr key={author.id}>
                <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                <td>{author.name}</td>
                <td>{author.books_count}</td>
                <td>
                  <div className="actions">
                    <button
                      className="icon-button"
                      onClick={() => setEditingAuthor(author)}
                      title="Update"
                      type="button"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      className="icon-button danger"
                      onClick={() => setDeletingAuthor(author)}
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

        {authors.length === 0 && (
          <div className="empty-state">No authors found.</div>
        )}

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onChange={setPage}
        />
      </div>

      {editingAuthor && (
        <EditModal
          title="Update Author"
          initialValues={{ name: editingAuthor.name }}
          fields={[
            {
              name: "name",
              label: "Name",
              required: true,
              errorMessage: "* Please enter name",
            },
          ]}
          onCancel={() => setEditingAuthor(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deletingAuthor && (
        <ConfirmModal
          title="Delete Author"
          message={`Are you sure you want to delete "${deletingAuthor.name}"?`}
          onCancel={() => setDeletingAuthor(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
