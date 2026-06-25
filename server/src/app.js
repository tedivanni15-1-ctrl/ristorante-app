import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import tablesRouter from "./routes/tables.routes.js";
import reservationsRouter from "./routes/reservations.routes.js";
import menuRouter from "./routes/menu.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requireAuth } from "./middlewares/requireAuth.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/v1/health", (req, res) => res.json({ status: "ok" }));

// Auth — pubblica
app.use("/api/v1/auth", authRouter);

// Route pubbliche (cliente)
app.use("/api/v1/reservations", reservationsRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/feedbacks", feedbackRouter);

// Route protette (solo staff autenticato)
app.use("/api/v1/tables", requireAuth, tablesRouter);
app.use("/api/v1/orders", requireAuth, ordersRouter);

app.use((req, res) => res.status(404).json({ error: "Endpoint non trovato" }));
app.use(errorHandler);

export default app;
