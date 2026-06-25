import { api } from "./api.js";

export const getReservations = () => api.get("/reservations");

export const createReservation = (data) => api.post("/reservations", data);
// data: { tavolo_id, data_ora, durata_minuti, nome_cliente, coperti }

export const updateReservation = (id, data) => api.put(`/reservations/${id}`, data);

export const cancelReservation = (id) => api.delete(`/reservations/${id}`);
