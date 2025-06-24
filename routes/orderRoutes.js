import { getOrder, getOrders } from "../controllers/orderController.js";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.get("/", ensureAuthenticated, getOrders);
router.get("/:order_id", ensureAuthenticated, getOrder);

export default router;