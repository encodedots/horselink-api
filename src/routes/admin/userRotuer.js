import express from 'express';
import { UsersController } from '../../controllers/admin/usersController';

// Multipart is used to get form-data request.
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const router = express.Router();
const usersController = new UsersController();

//#region GET APIs

router.get('/getUser/:id', usersController.getUser);
router.get('/getUserlist', usersController.getUserlist);

//#endregion GET APIs


//#region POST APIs

router.post('/getUsers', usersController.getUsers);
router.post('/addUser', multipartMiddleware, usersController.createUser);
router.post('/updateUser/:id', multipartMiddleware, usersController.updateUser);
router.post('/deleteUser/:id', usersController.deleteUser);

//#endregion POST APIs

export default router;