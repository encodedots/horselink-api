import { CommonService } from "../../services/admin/commonService";
import messages from "../../utils/message";
import { sendSuccessResponse, sendErrorResponse, adminSendSuccessResponse, adminSendErrorResponse } from '../../utils/sendResponse';
const _commonService = new CommonService();

export class CommonController {

    /**
     * Summary: This method is used to get all countries.
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async getCountries(req, res) {
        try {
            // Get all countries list
            var output = await _commonService.getCountries();
            
            if(output && output["status"] == false) {
                return adminSendErrorResponse(res, 201, output["error"]);
            }
            // Return response
            return adminSendSuccessResponse(res, 200, output, messages.RETRIEVE_SUCCESSFULLY);
        } catch (e) {
            // Return error response
            return adminSendErrorResponse(res, 500, e);
        }
    }

}