import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthorCreate } from "./pages/AuthorCreate";
import { AuthorsList } from "./pages/AuthorsList";
import { BookCreate } from "./pages/BookCreate";
import { BooksList } from "./pages/BooksList";
import { ReviewCreate } from "./pages/ReviewCreate";
import { ReviewsList } from "./pages/ReviewsList";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/authors" replace />} />
        <Route path="/authors" element={<AuthorsList />} />
        <Route path="/authors/create" element={<AuthorCreate />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/books/create" element={<BookCreate />} />
        <Route path="/reviews" element={<ReviewsList />} />
        <Route path="/reviews/create" element={<ReviewCreate />} />
      </Route>
    </Routes>
  );
}
