export function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;

        return (
          <button
            key={pageNumber}
            className={pageNumber === page ? "active" : ""}
            onClick={() => onChange(pageNumber)}
            type="button"
          >
            {pageNumber}
          </button>
        );
      })}
    </div>
  );
}
