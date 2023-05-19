import { HorseProductService } from "../../services/admin/horseProductService";
import Messages from "../../utils/message";
import { adminSendErrorResponse, adminSendSuccessResponse } from "../../utils/sendResponse";
import { isValidString, isValidInteger } from "../../utils/validation";

const _horseProductService = new HorseProductService();

export class HorseProductController {

    /**
     * Summary: This method returns specific user horse product details based on user id.
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async getHorseProducts(req, res) {
        var input = req.params.userId;

        try {
            // Validate input data
            if (!isValidInteger(input) || input < 1)
                return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

            // Call service to get specific user horse product based on id
            var output = await _horseProductService.getHorseProducts(input);

            if (output && output["status"] == false)
                return adminSendErrorResponse(res, 201, output["error"]);

            // Return response data
            return adminSendSuccessResponse(
                res,
                200,
                output,
                Messages.RETRIEVE_SUCCESSFULLY
            );
        } catch (e) {
            return adminSendErrorResponse(res, 201, e);
        }
    }

    /**
     * Summary: This method is used to add horse product details of user
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async addHorseProduct(req, res) {
        try {
            var input = req.body;
            var id = req.params.userId;

            // Validate input data
            if (input == null || !isValidString(input.title) || !isValidString(input.titleLink))
                return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

            // Call service to create new horse product entry
            var output = await _horseProductService.addHorseProduct(input, id);
            if (output == null)
                return adminSendErrorResponse(res, 201, Messages.SOMETHING_WENT_WRONG);

            if (output && output["status"] == false) {
                return adminSendErrorResponse(res, 201, output["error"]);
            }

            // Return response data
            return adminSendSuccessResponse(
                res,
                200,
                output,
                Messages.UPDATED_USER_SUCCESSFULLY
            );
        } catch (e) {
            // Send error message on fail
            return adminSendErrorResponse(res, 201, e);
        }
    }
}