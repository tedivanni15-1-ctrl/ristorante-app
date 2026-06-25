import { pool } from "../config/db.js";

const TRANSIZIONI_VALIDE = {
  PENDING: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  READY: ["SERVED"],
  SERVED: [],
  CANCELLED: [],
};

export async function listOrders(req, res, next) {
  try {
    const { stato } = req.query;
    const { rows } = stato
      ? await pool.query("SELECT * FROM ordini WHERE stato = $1 ORDER BY created_at", [stato])
      : await pool.query("SELECT * FROM ordini ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function createOrder(req, res, next) {
  const client = await pool.connect();
  try {
    const { prenotazione_id, righe } = req.body; // righe: [{ piatto_id, quantita, note }]

    await client.query("BEGIN");

    const { rows: ordineRows } = await client.query(
      "INSERT INTO ordini (prenotazione_id) VALUES ($1) RETURNING *",
      [prenotazione_id]
    );
    const ordine = ordineRows[0];

    for (const riga of righe || []) {
      await client.query(
        `INSERT INTO dettagli_ordine (ordine_id, piatto_id, quantita, note)
         VALUES ($1, $2, $3, $4)`,
        [ordine.id, riga.piatto_id, riga.quantita, riga.note || null]
      );
    }

    const { rows: totaleRows } = await client.query(
      `SELECT COALESCE(SUM(d.quantita * m.prezzo), 0) AS totale
       FROM dettagli_ordine d JOIN menu m ON m.id = d.piatto_id
       WHERE d.ordine_id = $1`,
      [ordine.id]
    );

    const { rows: updatedRows } = await client.query(
      "UPDATE ordini SET totale = $1 WHERE id = $2 RETURNING *",
      [totaleRows[0].totale, ordine.id]
    );

    await client.query("COMMIT");
    res.status(201).json(updatedRows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { stato: nuovoStato } = req.body;

    const { rows: current } = await pool.query("SELECT stato FROM ordini WHERE id = $1", [id]);
    if (current.length === 0) return res.status(404).json({ error: "Ordine non trovato" });

    const statoAttuale = current[0].stato;
    if (!TRANSIZIONI_VALIDE[statoAttuale]?.includes(nuovoStato)) {
      return res.status(400).json({
        error: `Transizione non permessa: ${statoAttuale} -> ${nuovoStato}`,
      });
    }

    const { rows } = await pool.query(
      "UPDATE ordini SET stato = $1 WHERE id = $2 RETURNING *",
      [nuovoStato, id]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "UPDATE ordini SET stato = 'CANCELLED' WHERE id = $1 AND stato = 'PENDING' RETURNING *",
      [id]
    );
    if (rows.length === 0) {
      return res.status(409).json({ error: "L'ordine non è annullabile (non è più PENDING)" });
    }
    res.json({ message: "Ordine annullato", ordine: rows[0] });
  } catch (err) {
    next(err);
  }
}
