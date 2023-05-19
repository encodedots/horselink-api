import express from "express";
import { authenticateJWT } from "../../middlewares/jwtAuthenticate";
import { HorseListController } from "../../controllers/admin/horseListController";
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

const router = express.Router();
var horseListController = new HorseListController();

router.post(
  "/create/:userId",
  [authenticateJWT, multipartMiddleware],
  horseListController.addHorseList
);

router.get(
  "/:userId",
  authenticateJWT,
  horseListController.getHorseListDetails
);
export default router;
