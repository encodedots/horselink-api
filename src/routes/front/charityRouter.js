import express from "express";
import { CharityController } from "../../controllers/front/charityController";
const router = express.Router();
const charityController = new CharityController();

// #region POST APIs
router.post("/sentCharityMail", charityController.sentCharityMail);
// #endregion POST APIs

export default router;
