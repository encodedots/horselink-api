import { UserService } from '../../services/admin/usersService';
import Messages from '../../utils/message';
import { adminSendErrorResponse, adminSendSuccessResponse } from '../../utils/sendResponse';
import { isValidArray, isValidInteger, isValidString } from '../../utils/validation';

const _userService = new UserService();

export class UsersController {

    //#region GET APIs

    /**
     * Summary: This method returns specific user's detail based on id.
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async getUser(req, res) {
        var input = req.params.id;

        try {
            // Validate input data
            if (!isValidInteger(input) || input < 1)
                return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

            // Call service to get specific user based in input
            var output = await _userService.getUser(input);

            // Return response data
            return adminSendSuccessResponse(res, 200, output, Messages.RETRIEVE_SUCCESSFULLY);
        } catch (e) {
            return adminSendErrorResponse(res, 201, e);
        }
    }

    /**
     * Summary: This method returns all register users.
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async getUserlist(req, res) {
        try {
            // Call service to get all users
            var output = await _userService.getUserlist();

            // Return response data
            return adminSendSuccessResponse(res, 200, output, Messages.RETRIEVE_SUCCESSFULLY);
        } catch (e) {
            return adminSendErrorResponse(res, 201, e);
        }
    }

    /**
     * Summary: This method is used to get all users.
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async getUsers(req, res) {
        var input = req.query;

        try {
            // Call service to get users
            var output = await _userService.getUsers(input);

            if(output && output["status"] == false) {
                return adminSendErrorResponse(res, 201, output["error"]);
            }
            // Return response data
            return adminSendSuccessResponse(res, 200, output, Messages.RETRIEVE_SUCCESSFULLY);
        } catch (e) {
            // Send error message on fail
            console.log("e111",e);
            return adminSendErrorResponse(res, 201, e);
        }
    }

    //#endregion GET APIs

    //#region POST APIs

       /**
     * Summary: This method is used to get all users.
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async updateUserStatus(req, res) {
        var input = req.body.status;
        var id = req.params.id;
        try {
            // Call service to get users
            var output = await _userService.updateUserStatus(id,input);

            if(output && output["status"] == false) {
                return adminSendErrorResponse(res, 201, output["error"]);
            }
            // Return response data
            return adminSendSuccessResponse(res, 200, output, Messages.UPDATED_SUCCESSFULLY);
        } catch (e) {
            // Send error message on fail
            return adminSendErrorResponse(res, 201, e);
        }
    }

    /**
     * Summary: This method is used to create new user.
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async createUser(req, res) {
        try {
            var input = req.body;

            // Validate input data
            if (input == null
                || !isValidString(input.firstName)
                || !isValidString(input.lastName)
                || !isValidString(input.userName)
                || !isValidString(input.email)
                || !isValidString(input.password)
                || !isValidString(input.town)
                || !isValidInteger(input.zipCode)
                || !isValidInteger(input.country)
                || !isValidInteger(input.telephone)
                ){
                    return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);
            }
            // Call service to create new user entry
            var output = await _userService.createUser(input);
            if (output == null)
                return adminSendErrorResponse(res, 201, Messages.SOMETHING_WENT_WRONG); 
            
            if(output && output["status"] == false) {
                return adminSendErrorResponse(res, 201, output["error"]);
            }        

            // Return response data
            return adminSendSuccessResponse(res, 200, output, Messages.CREATED_SUCCESSFULLY);
        } catch (e) {
            // Send error message on fail
            return adminSendErrorResponse(res, 201, e);
        }
    }

    /**
    * Summary: This method is used to update specific user based on id.
    * @param {*} req
    * @param {*} res
    * @returns
    */
    async updateUser(req, res) {
        try {
            var id = req.params.id;
            var input = req.body;

            // Validate input data
            if (id < 1 || input == null
                || !isValidString(input.firstName)
                || !isValidString(input.lastName)
                || !isValidString(input.userName)
                || !isValidString(input.email)
                || !isValidString(input.town)
                || !isValidInteger(input.zipCode)
                || !isValidInteger(input.country)
                || !isValidInteger(input.telephone))
                {
                   return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);
                }

            // Call service to update specific user
            var output = await _userService.updateUser(id, input);
            if (output == null)
                return adminSendErrorResponse(res, 201, Messages.SOMETHING_WENT_WRONG);
            
            if(output && output["status"] == false) {
                return adminSendErrorResponse(res, 201, output["error"]);
            }            
            // Return response data
            return adminSendSuccessResponse(res, 200, output, Messages.UPDATED_SUCCESSFULLY);
        } catch (e) {
            // Send error message on fail
            return adminSendErrorResponse(res, 201, e);
        }
    }

    /**
     * Summary: This method is used to delete specific user based on id.
     * @param {*} req
     * @param {*} res
     * @returns
     */
     async deleteUser(req, res) {
        var id = req.params.id;

        try {
            // Validate input data
            if (!isValidInteger(id) || id < 1)
                return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

            // Call service to delete specific user based on id
            var output = await _userService.deleteUser(id);
            if (output == null)
                return adminSendErrorResponse(res, 201, Messages.SOMETHING_WENT_WRONG);

            if(output && output["status"] == false) {
                return adminSendErrorResponse(res, 201, output["error"]);
            }

            // Return response data
            return adminSendSuccessResponse(res, 200, output, Messages.DELETED_SUCCESSFULLY);
        } catch (e) {
            // Send error message on fail
            return adminSendErrorResponse(res, 201, e);
        }
    }
    //#endregion POST APIs
}