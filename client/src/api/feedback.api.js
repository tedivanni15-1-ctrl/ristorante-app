import { api } from "./api.js";

export const getFeedback = (from, to) => {
  const params = new URLSearchParams();
  if (from) params.append("from", from);
  if (to)   params.append("to", to);
  const qs = params.toString();
  return api.get(`/feedbacks${qs ? "?" + qs : ""}`);
};

export const createFeedback = (data) => api.post("/feedbacks", data);
// data: { ordine_id, punteggio (1-5), recensione }
