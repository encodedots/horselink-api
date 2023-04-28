import express from "express";
import { UserSocialMediaController } from "../../controllers/admin/userSocialMediaController";
import { authenticateJWT } from "../../middlewares/jwtAuthenticate";
const router = express.Router();
const userSocialMediaController = new UserSocialMediaController();

//#region POST APIs
router.post(
  "/create/:userId",
  authenticateJWT,
  userSocialMediaController.addUserSocialMedia
);
//#endregion POST APIs

//#region GET APIs
router.get(
  "/:userId",
  authenticateJWT,
  userSocialMediaController.getUserSocialMedia
);
//#endregion GET APIs
export default router;
