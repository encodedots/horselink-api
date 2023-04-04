import { AdminUserService } from '../../services/admin/adminUsersService';
import messages from '../../utils/message';
import { sendErrorResponse, sendSuccessResponse } from "../../utils/sendResponse";
import { isValidInteger, isValidString } from '../../utils/validation';

const _adminUserService = new AdminUserService();

export class AdminUserController {

    //#region  GET APIs

    /**
     * Summary: This method is used to get specific admin details based on id
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async getAdmin(req, res) {
        try {
            var id = req.params.id;

            // Validate input data
            if (!req || !isValidInteger(id))
                return sendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

            // Call Service to get admin details
            var output = await _adminUserService.getAdminById(id);

            // Return response
            return sendSuccessResponse(res, 200, output, messages.RETRIEVE_SUCCESSFULLY);

        } catch (e) {
            // Send error message on fail
            return sendErrorResponse(res, 500, messages.SERVER_ERROR, e);
        }
    }

    //#endregion GET APIs

    //#region POST APIs

    /**
     * This function is used for the admin login
     * This function will create and authenticatin token which will be return to front end to access authorised API
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async adminLogin(req, res) {
        var input = req.body;

        try {
            // Validate input data
            if (input == null || (input && (!isValidString(input.email) || !isValidString(input.password))))
                return sendErrorResponse(res, 201, messages.INVALID_PARAMETERS, null);

            // Call service to get login user token and details
            var output = "";
            output = await _adminUserService.adminLogin(input);
            if (output == null)
                return sendErrorResponse(res, 201, messages.NOT_FOUND, null);

            // Return response
            return sendSuccessResponse(res, 200, {
                token: output.token.plainTextToken,
                user: {
                    id: output.user.id,
                    name: output.user.name,
                    email: output.user.email,
                },
            }, messages.LOGIN_SUCCESSFULLY);
        } catch (e) {
            return sendErrorResponse(res, 500, messages.SERVER_ERROR, e);
        }
    }

    //#endregion POST APIs
}