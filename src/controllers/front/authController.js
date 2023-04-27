import { AuthService } from "../../services/front/authService";
import messages from "../../utils/message";
import {
  frontSendErrorResponse,
  frontSendSuccessResponse
} from "../../utils/sendResponse";
import { isValidString } from "../../utils/validation";

const _authService = new AuthService();

export class AuthController {
  /**
   * Summary: This function is used for the front login
   * This function will create authenticate token which will be return to frontend to access authorised API
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async login(req, res) {
    var input = req.body;

    try {
      // Validate input data
      if (
        input == null ||
        (input &&
          (!isValidString(input.userName) || !isValidString(input.password)))
      )
        return frontSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Call service method to handle authentication
      var output = await _authService.login(input);
      if (output == null)
        return frontSendErrorResponse(res, 201, messages.SOMETHING_WENT_WRONG);

      if (output["status"] == false)
        return frontSendErrorResponse(res, 201, output["error"]);

      // Return response
      return frontSendSuccessResponse(
        res,
        200,
        output,
        messages.LOGIN_SUCCESSFULLY
      );
    } catch (e) {
      return frontSendErrorResponse(res, 201, e);
    }
  }
}
