import { Router } from "express";
import { createFeedback, listFeedback } from "../controllers/feedback.controller.js";

const router = Router();

router.post("/", createFeedback);
router.get("/", listFeedback);

export default router;
