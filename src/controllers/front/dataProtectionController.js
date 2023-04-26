import Messages from "../../utils/message";
import { DataProtectionService } from "../../services/front/dataProtectionService";
import { frontSendErrorResponse, frontSendSuccessResponse } from "../../utils/sendResponse";
import { isValidString } from "../../utils/validation";

const _dataProtectionService = new DataProtectionService();

export class DataProtectionController {

  /**
   * Summary: This function is used for sent mail for GDPR
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async sentDataProtectionMail(req, res) {
    var input = req.body;
    try {

      // Validate input data
      if (
        input == null ||
        (input &&
          (!isValidString(input.fullName) ||
            !isValidString(input.email) ||
            !isValidString(input.countryOfResidence) ||
            !isValidString(input.horseLinkTo)))
      )
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service method to handle store data in table and sent mail
      var output = await _dataProtectionService.sentDataProtectionMail(input);
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
      return frontSendErrorResponse(res, 201, e);
    }
  }
}
