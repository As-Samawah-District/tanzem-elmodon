import { Router } from "express";
import { protect } from "../controllers/userControllers";
import { getLogs } from "../controllers/logsController";
const router = Router();

router.post("/", protect, getLogs);
export default router;
