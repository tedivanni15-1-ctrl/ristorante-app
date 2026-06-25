import { api } from "./api.js";

// Lista tutti i tavoli con il loro stato attuale
export const getTables = () => api.get("/tables");

// Controlla disponibilità per data, ora e numero coperti
// date: "YYYY-MM-DD", time: "HH:MM", guests: number
export const getAvailability = (date, time, guests) =>
  api.get(`/tables/availability?date=${date}&time=${time}&guests=${guests}`);
