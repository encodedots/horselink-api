import express from "express";
import { AuthController } from "../../controllers/front/authController";
const router = express.Router();
const authController = new AuthController();

//#region POST APIs
router.post("/login", authController.login);
//#endregion POST APIs

export default router;
