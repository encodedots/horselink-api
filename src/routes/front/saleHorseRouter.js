import express from "express";
import { SaleHorseController } from "../../controllers/front/saleHorseController";
const router = express.Router();
const saleHorseController = new SaleHorseController();

// #region GET APIs
router.get("/getHorseCategory", saleHorseController.getHorseCategory);
router.get("/", saleHorseController.getHorseList);
// #endregion GET APIs
export default router;
