import { Router } from "express";
import { signUp, signIn, editUser, protect, deleteUser, getUsers } from "../controllers/userControllers";
const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.put('/:id', protect, editUser);
router.delete('/:id', protect, deleteUser)
router.get('/all', protect, getUsers)
export default router;
