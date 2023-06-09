import express from "express";
import { UserInfoController } from "../../controllers/admin/userInfoController";

import { authenticateJWT } from "../../middlewares/jwtAuthenticate";
const router = express.Router();
const userInfoController = new UserInfoController();

//#region GET APIs
router.get("/:userId", authenticateJWT, userInfoController.getUserInfo);
//#endregion GET APIs

//#region POST APIs
router.post("/create/:userId", authenticateJWT, userInfoController.addUserInfo);
//#endregion POST APIs

export default router;
