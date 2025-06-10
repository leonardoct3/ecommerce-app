import { Router } from "express";
import { registerUser, getUsers } from '../controllers/userController.js';

const router = Router();

router.post('/register', registerUser);
router.get('/users', getUsers);
router.get('/users/:id', getUsers);

export default router;