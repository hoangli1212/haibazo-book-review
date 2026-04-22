import { api } from "./client";

export const getAuthors = (page = 1, pageSize = 10) => {
  return api.get("/api/authors", {
    params: { page, page_size: pageSize },
  });
};

export const createAuthor = (data) => {
  return api.post("/api/authors", data);
};

export const updateAuthor = (id, data) => {
  return api.put(`/api/authors/${id}`, data);
};

export const deleteAuthor = (id) => {
  return api.delete(`/api/authors/${id}`);
};
