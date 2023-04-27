import express from "express";
import { UsersController } from "../../controllers/front/usersController";

// Multipart is used to get form-data request.
import { frontAuthenticateJWT } from "../../middlewares/frontAuthenticate";
const router = express.Router();
const usersController = new UsersController();

//#region GET APIs
router.get("/getUser/:id", frontAuthenticateJWT, usersController.getUser);

router.get(
  "/getUserInfo/:userId",
  frontAuthenticateJWT,
  usersController.getUserInfo
);
router.get("/getUserList", usersController.getUserList);

router.get(
  "/getSaleHorseDetails/:id",
  frontAuthenticateJWT,
  usersController.getSaleHorseDetails
);
//#endregion GET APIs
export default router;
