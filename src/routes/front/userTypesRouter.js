import express from "express";
import { UserTypesController } from "../../controllers/front/userTypesController";
const router = express.Router();
const userTypesController = new UserTypesController();

// #region GET APIs
router.get("/", userTypesController.getuserTypesList);
// #endregion GET APIs

export default router;