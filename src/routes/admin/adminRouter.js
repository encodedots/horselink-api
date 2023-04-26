import express from 'express';

import { AdminUserController } from '../../controllers/admin/adminController';
import { authenticateJWT } from "../../middlewares/jwtAuthenticate";
const router = express.Router();
var adminUserController = new AdminUserController();

//#region POST APIs
router.post('/login', adminUserController.login);
router.post('/logout', authenticateJWT, adminUserController.logout);
//#endregion

export default router;