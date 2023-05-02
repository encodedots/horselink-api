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

  /**
   * Summary: This function is used for register new user
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async register(req, res) {
    var input = req.body;
    try {
      // Validate input data
      if (
        input == null ||
        !isValidString(input.userName) ||
        !isValidString(input.email) ||
        !isValidString(input.password) ||
        !isValidString(input.firstName) ||
        !isValidString(input.lastName) ||
        !isValidString(input.planName) ||
        !isValidString(input.isNewsLetter)
      )
        return frontSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Call service method to handle authentication
      var output = await _authService.register(input);
      if (output == null)
        return frontSendErrorResponse(res, 201, messages.SOMETHING_WENT_WRONG);

      if (output["status"] == false)
        return frontSendErrorResponse(res, 201, output["error"]);

      // Return response
      return frontSendSuccessResponse(
        res,
        200,
        output,
        messages.REGISTER_SUCCESSFULLY
      );
    } catch (e) {
      return frontSendErrorResponse(res, 201, e);
    }
  }

  /**
   * Summary: This function is used for check the username and email is unique or not
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async checkEmailUserName(req, res) {
    var input = req.body;

    try {
      // Validate input data
      if (
        input == null ||
        !isValidString(input.userName) ||
        !isValidString(input.email)
      )
        return frontSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Call service method to check username and email
      var output = await _authService.checkEmailUserName(input);
      if (output == null)
        return frontSendErrorResponse(res, 201, messages.SOMETHING_WENT_WRONG);

      if (output["status"] == false)
        return frontSendErrorResponse(res, 201, output["error"]);

      // Return response
      return frontSendSuccessResponse(
        res,
        200,
        output,
        messages.RETRIEVE_SUCCESSFULLY
      );
    } catch (e) {
      return frontSendErrorResponse(res, 201, e);
    }
  }
}
