import { Router } from "express";
import {
  createReservation,
  listReservations,
  updateReservation,
  cancelReservation,
} from "../controllers/reservations.controller.js";

const router = Router();

router.get("/", listReservations);
router.post("/", createReservation);
router.put("/:id", updateReservation);
router.delete("/:id", cancelReservation);

export default router;
