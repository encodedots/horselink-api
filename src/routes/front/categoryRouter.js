import express from "express";
import { CategoryController } from "../../controllers/front/categoryController";
const router = express.Router();
const categroyController = new CategoryController();

// #region GET APIs
router.get("/", categroyController.getCategoryList);
// #endregion GET APIs

export default router;
