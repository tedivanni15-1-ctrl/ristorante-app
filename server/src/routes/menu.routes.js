import { Router } from "express";
import {
  listMenu,
  createMenuItem,
  updateMenuItem,
  deactivateMenuItem,
} from "../controllers/menu.controller.js";

const router = Router();

router.get("/", listMenu);
router.post("/", createMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deactivateMenuItem);

export default router;
