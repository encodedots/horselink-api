import { CharityService } from "../../services/front/charityService";
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

const _charityService = new CharityService();

export class CharityController {
  /**
   * Summary: This function is used for the front sent mail for charity account
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async sentCharityMail(req, res) {
    var input = req.body;
    try {
      // Validate input data
      if (
        input == null ||
        (input &&
          (!isValidString(input.userName) ||
            !isValidString(input.email) ||
            !isValidString(input.charityName) ||
            !isValidString(input.charityWebsite)))
      )
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service method to handle store data in table and sent mail
      var output = await _charityService.sentCharityMail(input);
      if (output == null)
        return frontSendErrorResponse(res, 201, Messages.SOMETHING_WENT_WRONG);

      if (output["status"] == false)
        return frontSendErrorResponse(res, 201, output["error"]);

      // Return response
      return frontSendSuccessResponse(
        res,
        200,
        output,
        Messages.MAIL_SENT_SUCCESSFULLY
      );
    } catch (e) {
      return frontSendErrorResponse(res, 500, e);
    }
  }
}
