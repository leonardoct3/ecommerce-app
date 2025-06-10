import { Router } from "express";
import { createProduct, alterProduct } from "../controllers/productsController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.post('/', createProduct);
router.put('/:id', alterProduct);

export default router;
