import express from "express";
import { AuthController } from "../../controllers/front/authController";
import { frontAuthenticateJWT } from "../../middlewares/frontAuthenticate";
const router = express.Router();
const authController = new AuthController();

//#region POST APIs
router.post("/login", authController.login);

router.post("/register", authController.register);

router.post("/checkEmailUserName", authController.checkEmailUserName);
router.post("/userActivate", authController.userActivate);
router.post("/logout", [frontAuthenticateJWT], authController.logout);
//#endregion POST APIs

export default router;
