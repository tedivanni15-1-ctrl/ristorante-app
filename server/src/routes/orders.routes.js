import { Router } from "express";
import {
  listOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orders.controller.js";

const router = Router();

router.get("/", listOrders);
router.post("/", createOrder);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", cancelOrder);

export default router;
