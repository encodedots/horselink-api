import { UserTypesService } from "../../services/front/userTypesService";
import Messages from "../../utils/message";
import { frontSendErrorResponse, frontSendSuccessResponse } from "../../utils/sendResponse";

const _userTypesService = new UserTypesService();

export class UserTypesController {

    /**
     * Summary: This method returns all user types.
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async getuserTypesList(req, res) {
        try {
            // Call service to get all user types
            var output = await _userTypesService.getUserTypesList();

            if (output["status"] == false)
                return frontSendErrorResponse(res, 201, output["error"]);

            // Return response data
            return frontSendSuccessResponse(
                res,
                200,
                output,
                Messages.RETRIEVE_SUCCESSFULLY
            );
        } catch (e) {
            return frontSendErrorResponse(res, 201, e);
        }
    }
}
