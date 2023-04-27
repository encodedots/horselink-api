import { SponsorService } from "../../services/admin/sponsorService";
import Messages from "../../utils/message";
import { adminSendErrorResponse, adminSendSuccessResponse } from "../../utils/sendResponse";
import { isValidString, isValidInteger, isValidArray } from "../../utils/validation";

const _sponsorService = new SponsorService();

export class SponsorController {

    /**
     * Summary: This method returns sponsor details based on user id.
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async getSponsor(req, res) {
        var input = req.params.userId;

        try {
            // Validate input data
            if (!isValidInteger(input) || input < 1)
                return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

            // Call service to get specific sponsor based on id
            var output = await _sponsorService.getSponsor(input);

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
     * Summary: This method is used to add/update sponsor information
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async addSponser(req, res) {
        try {
            var input = req.body;
            var id = req.params.userId;

            // Validate input data
            if (input == null || !isValidString(input.title) || !isValidArray(input.sponsors) ||
                (isValidArray(input.sponsors) && !isValidString(input.sponsors[0].name)))
                return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

            // Call service to add/update sponsor
            var output = await _sponsorService.addSponser(input, id);
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
