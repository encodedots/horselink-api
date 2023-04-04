import { UserService } from '../../services/admin/usersService';
import Messages from '../../utils/message';
import { sendSuccessResponse, sendErrorResponse } from '../../utils/sendResponse';
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
                return sendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

            // Call service to get specific user based in input
            var output = await _userService.getUser(input);

            // Return response data
            return sendSuccessResponse(res, 200, output, Messages.RETRIEVE_SUCCESSFULLY);
        } catch (e) {
            return sendErrorResponse(res, 201, Messages.COULD_NOT_PERFORM_ACTION, e);
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
            return sendSuccessResponse(res, 200, output, Messages.RETRIEVE_SUCCESSFULLY);
        } catch (e) {
            return sendErrorResponse(res, 201, Messages.COULD_NOT_PERFORM_ACTION, e);
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
    async getUsers(req, res) {
        var input = req.body;

        try {
            // Call service to get users
            var output = await _userService.getUsers(input);

            // Return response data
            return sendSuccessResponse(res, 200, output, Messages.RETRIEVE_SUCCESSFULLY);
        } catch (e) {
            // Send error message on fail
            return sendErrorResponse(res, 201, Messages.COULD_NOT_PERFORM_ACTION, e);
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
            var inputFiles = req.files;

            // Validate input data
            if (input == null
                || !isValidString(input.firstName)
                || !isValidString(input.lastName)
                || !isValidString(input.userName)
                || !isValidString(input.email)
                || !isValidString(input.password)
                || (input.description && input.description.length > 200)
                || !isValidString(input.memberNumber)
                || !isValidString(input.town)
                || !isValidString(input.zipCode)
                || !isValidInteger(input.country)
                || !isValidString(input.telephone)
                || !isValidString(input.businessTown)
                || !isValidString(input.businessZipCode)
                || !isValidInteger(input.businessCountry)
                || !isValidString(input.businessTelephone)
                || !isValidArray(input.preferences))
                return sendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

            // Call service to create new user entry
            var output = await _userService.createUser(input, inputFiles);
            if (output == null)
                return sendErrorResponse(res, 201, Messages.SOMETHING_WENT_WRONG, null);

            // Return response data
            return sendSuccessResponse(res, 200, output, Messages.CREATED_SUCCESSFULLY);
        } catch (e) {
            // Send error message on fail
            return sendErrorResponse(res, 201, Messages.COULD_NOT_PERFORM_ACTION, e);
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
            var inputFiles = req.files;

            // Validate input data
            if (id < 1 || input == null
                || !isValidString(input.firstName)
                || !isValidString(input.lastName)
                || !isValidString(input.userName)
                || !isValidString(input.email)
                || (input.description && input.description.length > 200)
                || !isValidString(input.memberNumber)
                || !isValidString(input.town)
                || !isValidString(input.zipCode)
                || !isValidInteger(input.country)
                || !isValidString(input.telephone)
                || !isValidString(input.businessTown)
                || !isValidString(input.businessZipCode)
                || !isValidInteger(input.businessCountry)
                || !isValidString(input.businessTelephone)
                || !isValidArray(input.preferences))
                return sendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);


            // Call service to update specific user
            var output = await _userService.updateUser(id, input, inputFiles);
            if (output == null)
                return sendErrorResponse(res, 201, Messages.SOMETHING_WENT_WRONG, null);

            // Return response data
            return sendSuccessResponse(res, 200, output, Messages.UPDATED_SUCCESSFULLY);
        } catch (e) {
            // Send error message on fail
            return sendErrorResponse(res, 201, Messages.COULD_NOT_PERFORM_ACTION, e);
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
                return sendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

            // Call service to delete specific user based on id
            var output = await _userService.deleteUser(id);
            if (output == null)
                return sendErrorResponse(res, 201, Messages.SOMETHING_WENT_WRONG, e);

            // Return response data
            return sendSuccessResponse(res, 200, output, Messages.DELETED_SUCCESSFULLY);
        } catch (e) {
            // Send error message on fail
            return sendErrorResponse(res, 201, Messages.COULD_NOT_PERFORM_ACTION, e);
        }
    }

    //#endregion POST APIs
}