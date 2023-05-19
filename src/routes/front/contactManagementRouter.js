import express from "express";
import { ContactManagementController } from "../../controllers/front/contactManagementController";
const router = express.Router();
const contactManagementController = new ContactManagementController();

// #region POST APIs
router.post("/sentContactsMail", contactManagementController.sentContactsMail);
// #endregion POST APIs

export default router;
