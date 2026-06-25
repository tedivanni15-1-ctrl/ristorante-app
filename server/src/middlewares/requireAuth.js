import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Accesso non autorizzato — token mancante" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "segreto_dev");
    req.utente = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token non valido o scaduto" });
  }
}
