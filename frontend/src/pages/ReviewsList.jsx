import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../api/books";
import { deleteReview, getReviews, updateReview } from "../api/reviews";
import { ConfirmModal } from "../components/ConfirmModal";
import { EditModal } from "../components/EditModal";
import { PageHeader } from "../components/PageHeader";
import { Pagination } from "../components/Pagination";

const PAGE_SIZE = 10;

export function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const [deletingReview, setDeletingReview] = useState(null);

  const loadReviews = async () => {
    const response = await getReviews(page, PAGE_SIZE);
    setReviews(response.data.items);
    setTotal(response.data.total);
  };

  const loadBooks = async () => {
    const response = await getBooks(1, 100);
    setBooks(response.data.items);
  };

  useEffect(() => {
    loadReviews();
  }, [page]);

  useEffect(() => {
    loadBooks();
  }, []);

  const handleUpdate = async (values) => {
    await updateReview(editingReview.id, {
      book_id: Number(values.book_id),
      content: values.content,
    });
    setEditingReview(null);
    loadReviews();
  };

  const handleDelete = async () => {
    await deleteReview(deletingReview.id);
    setDeletingReview(null);
    loadReviews();
  };

  return (
    <>
      <PageHeader
        title="Reviews > List"
        action={
          <Link className="primary-button" to="/reviews/create">
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
              <th>Book</th>
              <th>Author</th>
              <th>Review</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review, index) => (
              <tr key={review.id}>
                <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                <td>{review.book_title}</td>
                <td>{review.author_name}</td>
                <td>{review.content}</td>
                <td>
                  <div className="actions">
                    <button
                      className="icon-button"
                      onClick={() => setEditingReview(review)}
                      title="Update"
                      type="button"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      className="icon-button danger"
                      onClick={() => setDeletingReview(review)}
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

        {reviews.length === 0 && (
          <div className="empty-state">No reviews found.</div>
        )}

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onChange={setPage}
        />
      </div>

      {editingReview && (
        <EditModal
          title="Update Review"
          initialValues={{
            book_id: editingReview.book_id,
            content: editingReview.content,
          }}
          fields={[
            {
              name: "book_id",
              label: "Book",
              type: "select",
              placeholder: "Select book",
              required: true,
              errorMessage: "* Please select book",
              options: books.map((book) => ({
                value: book.id,
                label: book.title,
              })),
            },
            {
              name: "content",
              label: "Review",
              type: "textarea",
              required: true,
              errorMessage: "* Please enter review",
            },
          ]}
          onCancel={() => setEditingReview(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deletingReview && (
        <ConfirmModal
          title="Delete Review"
          message="Are you sure you want to delete this review?"
          onCancel={() => setDeletingReview(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
