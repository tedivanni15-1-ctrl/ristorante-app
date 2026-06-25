import { pool } from "../config/db.js";

export async function listMenu(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT m.*, c.nome AS categoria
       FROM menu m
       JOIN categorie c ON c.id = m.categoria_id
       WHERE m.is_active = true
       ORDER BY c.nome, m.nome`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function createMenuItem(req, res, next) {
  try {
    const { nome, descrizione, prezzo, categoria_id } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO menu (nome, descrizione, prezzo, categoria_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nome, descrizione, prezzo, categoria_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function updateMenuItem(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, descrizione, prezzo, categoria_id } = req.body;
    const { rows } = await pool.query(
      `UPDATE menu
       SET nome = COALESCE($1, nome),
           descrizione = COALESCE($2, descrizione),
           prezzo = COALESCE($3, prezzo),
           categoria_id = COALESCE($4, categoria_id)
       WHERE id = $5
       RETURNING *`,
      [nome, descrizione, prezzo, categoria_id, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Piatto non trovato" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function deactivateMenuItem(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "UPDATE menu SET is_active = false WHERE id = $1 RETURNING *",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Piatto non trovato" });
    res.json({ message: "Piatto disattivato", piatto: rows[0] });
  } catch (err) {
    next(err);
  }
}
