import express from "express";
import { FaqController } from "../../controllers/front/faqController";
const router = express.Router();
const faqController = new FaqController();

// #region GET APIs
router.get("/getFaqList/:module", faqController.getFaqList);
// #endregion GET APIs

export default router;
