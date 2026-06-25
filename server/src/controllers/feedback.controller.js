import { pool } from "../config/db.js";

export async function createFeedback(req, res, next) {
  try {
    const { ordine_id, punteggio, recensione } = req.body;

    const { rows: ordineRows } = await pool.query("SELECT stato FROM ordini WHERE id = $1", [
      ordine_id,
    ]);
    if (ordineRows.length === 0) {
      return res.status(404).json({ error: "Ordine non trovato" });
    }
    if (ordineRows[0].stato !== "SERVED") {
      return res.status(400).json({ error: "Il feedback è ammesso solo per ordini serviti" });
    }

    const { rows } = await pool.query(
      `INSERT INTO feedbacks (ordine_id, punteggio, recensione)
       VALUES ($1, $2, $3) RETURNING *`,
      [ordine_id, punteggio, recensione]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function listFeedback(req, res, next) {
  try {
    const { from, to } = req.query;

    const { rows } = await pool.query(
      `SELECT * FROM feedbacks
       WHERE ($1::timestamp IS NULL OR created_at >= $1)
         AND ($2::timestamp IS NULL OR created_at <= $2)
       ORDER BY created_at DESC`,
      [from || null, to || null]
    );

    const media =
      rows.length > 0 ? rows.reduce((sum, f) => sum + f.punteggio, 0) / rows.length : null;

    res.json({ feedbacks: rows, punteggio_medio: media });
  } catch (err) {
    next(err);
  }
}
