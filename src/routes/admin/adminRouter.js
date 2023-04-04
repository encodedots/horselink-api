import express from 'express';

import { AdminUserController } from '../../controllers/admin/adminController';

const router = express.Router();
var adminUserController = new AdminUserController();

//#region GET APIs

router.get('/getAdmin/:id', adminUserController.getAdmin);

//#endregion

//#region POST APIs

router.post('/adminLogin', adminUserController.adminLogin);

//#endregion

export default router;