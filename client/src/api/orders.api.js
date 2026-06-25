import { api } from "./api.js";

export const getOrders = (stato) =>
  api.get(stato ? `/orders?stato=${stato}` : "/orders");

export const createOrder = (data) => api.post("/orders", data);
// data: { prenotazione_id, righe: [{ piatto_id, quantita, note }] }

export const updateOrderStatus = (id, stato) =>
  api.patch(`/orders/${id}/status`, { stato });

export const cancelOrder = (id) => api.delete(`/orders/${id}`);
