import { api } from "./client";

export const getBooks = (page = 1, pageSize = 10) => {
  return api.get("/api/books", {
    params: { page, page_size: pageSize },
  });
};

export const createBook = (data) => {
  return api.post("/api/books", data);
};

export const updateBook = (id, data) => {
  return api.put(`/api/books/${id}`, data);
};

export const deleteBook = (id) => {
  return api.delete(`/api/books/${id}`);
};
