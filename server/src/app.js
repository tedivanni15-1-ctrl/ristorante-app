import express from "express";
import cors from "cors";

import tablesRouter from "./routes/tables.routes.js";
import reservationsRouter from "./routes/reservations.routes.js";
import menuRouter from "./routes/menu.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1/tables", tablesRouter);
app.use("/api/v1/reservations", reservationsRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/feedbacks", feedbackRouter);

app.use((req, res) => res.status(404).json({ error: "Endpoint non trovato" }));
app.use(errorHandler);

export default app;
