import { AuthService } from "../../services/front/authService";
import messages from "../../utils/message";
import {
  frontSendErrorResponse,
  frontSendSuccessResponse
} from "../../utils/sendResponse";
import { isValidString } from "../../utils/validation";
import Random from "../../utils/random";

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

  /**
   * Summary: This method is used to remove refresh token from refresh token array. It would be considered as logout.
   *          So that anyone with specific refresh token can not access the system.
   *          If the refresh token is stolen from the user, someone can use it to generate as many new tokens as they'd like.
   *          To avoid this, we implemented logout
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async logout(req, res) {
    var input = req.body;

    try {
      var authHeader = req.headers.authorization;
      var token = "";
      if (authHeader) {
        token = authHeader.split(" ")[1];
      }
      // Validate token
      if (token == null || token == "" || !isValidString(token))
        return frontSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Validate input data
      if (input == null || !isValidString(input.email))
        return frontSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Call sevice to logout user from the system
      var output = await _authService.logout(input, token);
      if (output == null)
        return frontSendErrorResponse(res, 201, messages.SOMETHING_WENT_WRONG);

      if (output["status"] == false)
        return frontSendErrorResponse(res, 201, output["error"]);

      // Return response
      return frontSendSuccessResponse(
        res,
        200,
        output,
        messages.LOGOUT_SUCCESSFULLY
      );
    } catch (e) {
      // Return error
      return frontSendErrorResponse(res, 201, e);
    }
  }

  /**
   * Summary: This function is used for activate the user
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async userActivate(req, res) {
    var input = req.body;

    try {
      // Validate input data
      if (input == null || !isValidString(input.webId))
        return frontSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Call service method to check username and email
      var output = await _authService.userActivate(input);
      if (output == null)
        return frontSendErrorResponse(res, 201, messages.SOMETHING_WENT_WRONG);

      if (output["status"] == false)
        return frontSendErrorResponse(res, 201, output["error"]);

      // Return response
      return frontSendSuccessResponse(
        res,
        200,
        output,
        messages.ACCOUNT_VERIFIED
      );
    } catch (e) {
      return frontSendErrorResponse(res, 201, e);
    }
  }

  /**
   * Summary: This method is used to sent forgot password link to received email id.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async forgotPassword(req, res) {
    var input = req.body;

    try {
      // Validate input data
      if (input == null || !isValidString(input.email))
        return frontSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Call service to send forgot password mail
      var output = await _authService.forgotPassword(input);
      if (output["status"] == false)
        return frontSendErrorResponse(res, 201, output["error"]);

      return frontSendSuccessResponse(
        res,
        200,
        "",
        messages.PASSWORD_RESET_EMAIL_SENT_SUCCESSFULLY
      );
    } catch (e) {
      return frontSendErrorResponse(res, 201, e);
    }
  }

  /**
   * Summary: This method is used to reset password for the specific user.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async resetPassword(req, res) {
    var input = req.body;

    try {
      // Validate input data
      if (
        input == null ||
        !isValidString(input.webId) ||
        !isValidString(input.password)
      )
        return frontSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Call service to reset password
      var output = await _authService.resetPassword(input);
      if (output == null)
        return frontSendErrorResponse(res, 201, messages.SOMETHING_WENT_WRONG);

      if (output["status"] == false)
        return frontSendErrorResponse(res, 201, output["error"]);

      return frontSendSuccessResponse(
        res,
        200,
        output,
        messages.PASSWORD_RESET_SUCCESSFULLY
      );
    } catch (e) {
      return frontSendErrorResponse(res, 500, e);
    }
  }
}
