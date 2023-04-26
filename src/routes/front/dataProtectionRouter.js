import express from "express";
import { DataProtectionController } from "../../controllers/front/dataProtectionController";
const router = express.Router();
const dataProtectionController = new DataProtectionController();

// #region POST APIs
router.post(
  "/sentDataProtectionMail",
  dataProtectionController.sentDataProtectionMail
);
// #endregion POST APIs

export default router;
