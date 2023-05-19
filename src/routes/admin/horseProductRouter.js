import express from "express";
import { authenticateJWT } from "../../middlewares/jwtAuthenticate";
import { HorseProductController } from "../../controllers/admin/horseProductController";

const router = express.Router();
const horseProductController = new HorseProductController();

//#region GET APIs
router.get("/:userId", authenticateJWT, horseProductController.getHorseProducts);
//#endregion GET APIs

//#region POST APIs
router.post("/create/:userId", authenticateJWT, horseProductController.addHorseProduct);
//#endregion POST APIs

export default router;
