import express from 'express';
import { CommonController } from '../../controllers/admin/commonController';
import { authenticateJWT } from "../../middlewares/jwtAuthenticate";
const router = express.Router();
var commonController = new CommonController();

//#region GET APIs
router.get('/getCountries',authenticateJWT, commonController.getCountries);
//#endregion GET APIs

export default router;