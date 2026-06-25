import { pool } from "../config/db.js";

export async function createReservation(req, res, next) {
  try {
    const { tavolo_id, data_ora, durata_minuti = 90, nome_cliente, coperti } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO prenotazioni (tavolo_id, data_ora, durata_minuti, nome_cliente, coperti)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tavolo_id, data_ora, durata_minuti, nome_cliente, coperti]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function listReservations(req, res, next) {
  try {
    const { rows } = await pool.query("SELECT * FROM prenotazioni ORDER BY data_ora DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function updateReservation(req, res, next) {
  try {
    const { id } = req.params;
    const { data_ora, durata_minuti, coperti } = req.body;

    const { rows } = await pool.query(
      `UPDATE prenotazioni
       SET data_ora = COALESCE($1, data_ora),
           durata_minuti = COALESCE($2, durata_minuti),
           coperti = COALESCE($3, coperti)
       WHERE id = $4 AND stato = 'ATTIVA'
       RETURNING *`,
      [data_ora, durata_minuti, coperti, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Prenotazione non trovata o non più attiva" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function cancelReservation(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `UPDATE prenotazioni SET stato = 'ANNULLATA'
       WHERE id = $1 AND stato = 'ATTIVA'
       RETURNING *`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Prenotazione non trovata o già annullata" });
    }
    res.json({ message: "Prenotazione annullata", reservation: rows[0] });
  } catch (err) {
    next(err);
  }
}
