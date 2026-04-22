import { api } from "./client";

export const getReviews = (page = 1, pageSize = 10) => {
  return api.get("/api/reviews", {
    params: { page, page_size: pageSize },
  });
};

export const createReview = (data) => {
  return api.post("/api/reviews", data);
};

export const updateReview = (id, data) => {
  return api.put(`/api/reviews/${id}`, data);
};

export const deleteReview = (id) => {
  return api.delete(`/api/reviews/${id}`);
};
