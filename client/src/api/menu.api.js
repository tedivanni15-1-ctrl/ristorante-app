import { api } from "./api.js";

export const getMenu = () => api.get("/menu");

export const createMenuItem = (data) => api.post("/menu", data);
// data: { nome, descrizione, prezzo, categoria_id }

export const updateMenuItem = (id, data) => api.put(`/menu/${id}`, data);

export const deactivateMenuItem = (id) => api.delete(`/menu/${id}`);
