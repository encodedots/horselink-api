import { ContactManagementService } from "../../services/front/contactManagementService";
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

const _contactManagementService = new ContactManagementService();

export class ContactManagementController {
  /**
   * Summary: This function is used for the front sent mail for help, reports and contact
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async sentContactsMail(req, res) {
    var input = req.body;
    try {
      // Validate input data
      if (
        input == null ||
        (input &&
          (!isValidString(input.firstName) ||
            !isValidString(input.lastName) ||
            !isValidString(input.email) ||
            !isValidString(input.message) ||
            !isValidString(input.type)))
      )
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service method to handle store data in table and sent mail
      var output = await _contactManagementService.sentContactsMail(input);
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
      console.log("e", e);
      return frontSendErrorResponse(res, 500, e);
    }
  }
}
