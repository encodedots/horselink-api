import express from "express";
import { SaleHorseController } from "../../controllers/admin/saleHorseController";
import { authenticateJWT } from "../../middlewares/jwtAuthenticate";

const router = express.Router();
var saleHorseController = new SaleHorseController();

router.post(
  "/create/:userId",
  authenticateJWT,
  saleHorseController.addHorseForSale
);

router.get(
  "/:userId",
  authenticateJWT,
  saleHorseController.getSaleHorseDetails
);
export default router;
