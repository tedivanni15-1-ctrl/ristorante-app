import { pool } from "../config/db.js";

export async function getTables(req, res, next) {
  try {
    const { rows } = await pool.query("SELECT * FROM tavoli ORDER BY numero");
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function getAvailability(req, res, next) {
  try {
    const { date, time, guests } = req.query;
    if (!date || !time || !guests) {
      return res.status(400).json({ error: "Parametri date, time e guests obbligatori" });
    }
    const dataOra = `${date} ${time}`;

    const { rows } = await pool.query(
      `SELECT t.*
       FROM tavoli t
       WHERE t.capienza >= $1
         AND NOT EXISTS (
           SELECT 1 FROM prenotazioni p
           WHERE p.tavolo_id = t.id
             AND p.stato = 'ATTIVA'
             AND p.periodo && tsrange($2::timestamp, $2::timestamp + interval '90 minutes')
         )
       ORDER BY t.capienza`,
      [guests, dataOra]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}
