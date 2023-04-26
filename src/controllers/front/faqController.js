import { FaqService } from "../../services/front/faqService";
import Messages from "../../utils/message";
import {
  frontSendErrorResponse,
  frontSendSuccessResponse
} from "../../utils/sendResponse";
import {
  isValidArray,
  isValidInteger,
  isValidString
} from "../../utils/validation";

const _faqService = new FaqService();

export class FaqController {
  /**
   * Summary: This method returns all register users.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getFaqList(req, res) {
    try {
      // Call service to get all users
      var output = await _faqService.getFaqList();
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
