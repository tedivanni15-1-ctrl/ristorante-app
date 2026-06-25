import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username e password obbligatori" });
    }

    const { rows } = await pool.query(
      "SELECT * FROM utenti WHERE username = $1",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenziali non valide" });
    }

    const utente = rows[0];
    const passwordOk = await bcrypt.compare(password, utente.password_hash);

    if (!passwordOk) {
      return res.status(401).json({ error: "Credenziali non valide" });
    }

    const token = jwt.sign(
      { id: utente.id, username: utente.username, ruolo: utente.ruolo },
      process.env.JWT_SECRET || "segreto_dev",
      { expiresIn: "8h" }
    );

    res.json({
      token,
      utente: { id: utente.id, username: utente.username, ruolo: utente.ruolo },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json(req.utente);
}
