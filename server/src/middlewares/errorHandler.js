export function errorHandler(err, req, res, next) {
  console.error(err);

  // Violazione exclusion constraint (prenotazioni sovrapposte sullo stesso tavolo)
  if (err.code === "23P01") {
    return res.status(409).json({
      error: "Conflitto: il tavolo è già prenotato in questo intervallo orario",
    });
  }

  // Violazione vincolo CHECK / Foreign Key
  if (err.code === "23514" || err.code === "23503") {
    return res.status(400).json({ error: "Dati non validi", detail: err.detail });
  }

  res.status(err.status || 500).json({ error: err.message || "Errore interno del server" });
}
