import express from "express";
import { UsersController } from "../../controllers/front/usersController";

// Multipart is used to get form-data request.
import { frontAuthenticateJWT } from "../../middlewares/frontAuthenticate";
const router = express.Router();
const usersController = new UsersController();

//#region GET APIs
router.get("/getUser/:id", frontAuthenticateJWT, usersController.getUser);

router.get("/getUserInfo/:userId", usersController.getUserInfo);
router.get("/getUserList", usersController.getUserList);

router.get("/getSponsorDetails/:id", usersController.getSponsorDetails);

router.get("/getSaleHorseDetails/:id", usersController.getSaleHorseDetails);

router.get(
  "/getUserSocialMediaDetails/:id",
  frontAuthenticateJWT,
  usersController.getUserSocialMediaDetails
);

router.get("/getTitles/:userId", usersController.getTitles);

router.get("/getUserBySlug/:userNameSlug", usersController.getUserBySlug);

router.get("/getHorseList/:id", usersController.getHorseList);

router.get("/getHorseProductList/:id", usersController.getHorseProductList);
//#endregion GET APIs

//#region POST APIs
router.post(
  "/update/:id",
  frontAuthenticateJWT,
  usersController.updateUserDeatils
); // :id - user web id
router.post("/verifyUpdateEmail/:id", usersController.verifyUpdateEmail); // :id - user web id
//#endregion POST APIs

//#region DELETE APIs
router.delete("/delete/:id", frontAuthenticateJWT, usersController.deleteUser); // :id - user web id
//#endregion DELETE APIs

export default router;
