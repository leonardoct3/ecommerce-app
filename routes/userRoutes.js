import { Router } from "express";
import { registerUser, getUsers, getUser, deleteUser, editUser } from '../controllers/userController.js';

const router = Router();

router.post('/register', registerUser);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.delete('/users/:id', deleteUser);
router.put("/users/:id", editUser);

export default router;