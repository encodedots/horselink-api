import express from "express";
import { CommonController } from "../../controllers/admin/commonController";
const router = express.Router();
var commonController = new CommonController();

//#region GET APIs
router.get("/getCountries", commonController.getCountries);
router.get("/getCategoryList", commonController.getCategoryList);
//#endregion GET APIs

export default router;
