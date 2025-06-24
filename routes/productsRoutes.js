import { Router } from "express";
import { createProduct, alterProduct, removeProduct, getProduct } from "../controllers/productsController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.post('/', createProduct);
router.put('/:id', alterProduct);
router.delete('/:id', removeProduct);
router.get('/', ensureAuthenticated, getProduct);

export default router;
