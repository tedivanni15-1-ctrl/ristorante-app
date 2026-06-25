import { Router } from "express";
import { getTables, getAvailability } from "../controllers/tables.controller.js";

const router = Router();

router.get("/", getTables);
router.get("/availability", getAvailability);

export default router;
