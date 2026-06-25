import { Router } from "express";
import {
  listMenu,
  createMenuItem,
  updateMenuItem,
  deactivateMenuItem,
} from "../controllers/menu.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

// Pubblica — cliente può vedere il menu
router.get("/", listMenu);

// Protette — solo staff autenticato
router.post("/", requireAuth, createMenuItem);
router.put("/:id", requireAuth, updateMenuItem);
router.delete("/:id", requireAuth, deactivateMenuItem);

export default router;
