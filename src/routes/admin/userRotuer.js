import express from "express";
import { UsersController } from "../../controllers/admin/usersController";

// Multipart is used to get form-data request.
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
import { authenticateJWT } from "../../middlewares/jwtAuthenticate";
const router = express.Router();
const usersController = new UsersController();

//#region GET APIs

router.get("/getUser/:id", authenticateJWT, usersController.getUser);
router.get("/getUserList", authenticateJWT, usersController.getUserList);
router.get("/getUsers", authenticateJWT, usersController.getUsers);

//#endregion GET APIs

//#region POST APIs

router.post(
  "/create",
  authenticateJWT,
  multipartMiddleware,
  usersController.createUser
);
router.post("/addContact/:id", authenticateJWT, usersController.addContact);

router.post(
  "/updateUser/:id",
  authenticateJWT,
  multipartMiddleware,
  usersController.updateUser
);
router.delete("/deleteUser/:id", authenticateJWT, usersController.deleteUser);

router.post(
  "/updateUserStatus/:id",
  authenticateJWT,
  usersController.updateUserStatus
);

//#endregion POST APIs

export default router;
