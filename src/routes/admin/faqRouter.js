import express from "express";
import { FaqController } from "../../controllers/admin/faqController";

import { authenticateJWT } from "../../middlewares/jwtAuthenticate";
const router = express.Router();
const faqController = new FaqController();

//#region GET APIs
router.get("/getFaqList", authenticateJWT, faqController.getFaqList);
router.get("/:id", authenticateJWT, faqController.getFaqDetails);
//#endregion GET APIs

//#region POST APIs
router.post("/create", authenticateJWT, faqController.addFaqDetails);
router.post("/update/:id", authenticateJWT, faqController.updateFaqDetails);
router.post("/updateFaqStatus/:id", authenticateJWT, faqController.updateFaqStatus);
//#endregion POST APIs

//#region DELETE APIs
router.delete("/delete/:id", authenticateJWT, faqController.deleteFaqDetails);
//#endregion DELETE APIs

export default router;
