import { Router } from "express";
import { protect } from "../controllers/userControllers";
import { addForm, deleteForm, download, editForm, filter, getForm, getFormNumber, getForms } from "../controllers/formController";
import upload from "../utils/multer";
const router = Router();

router.post("/", protect,upload.any(), addForm);
router.get('/formNumber', getFormNumber)
router.get('/forms', protect, getForms)
router.post('/filter', protect, filter)
router.get('/:id', getForm)
router.delete('/:id', protect,  deleteForm)
router.put('/:id',protect, editForm)
router.post('/download', protect, download)
export default router;
