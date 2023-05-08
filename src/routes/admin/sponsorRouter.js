import express from "express";

import { authenticateJWT } from "../../middlewares/jwtAuthenticate";
import { SponsorController } from "../../controllers/admin/sponsorController";
const router = express.Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const sponsorController = new SponsorController();

//#region GET APIs
router.get("/:userId", authenticateJWT, sponsorController.getSponsor);
//#endregion GET APIs

//#region POST APIs
router.post(
  "/create/:userId",
  [authenticateJWT, multipartMiddleware],
  sponsorController.addSponser
);
//#endregion POST APIs

export default router;
