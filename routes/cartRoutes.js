import { createCart, getCart, deleteCartItem, changeCartItems, changeItemQty, checkout } from "../controllers/cartController.js";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.post("/", ensureAuthenticated, createCart);
router.get("/:cart_id", ensureAuthenticated, getCart);
router.delete("/:cart_id/items/:product_id", ensureAuthenticated, deleteCartItem);
router.patch("/:cart_id/items/:product_id", ensureAuthenticated, changeItemQty);
router.post("/:cart_id/items", ensureAuthenticated, changeCartItems);
router.post("/:cart_id/checkout", ensureAuthenticated, checkout);

export default router;