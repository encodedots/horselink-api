import { UserInfoService } from "../../services/admin/userInfoService";
import Messages from "../../utils/message";
import {
  adminSendErrorResponse,
  adminSendSuccessResponse
} from "../../utils/sendResponse";
import { isValidString, isValidInteger } from "../../utils/validation";

const _userInfoService = new UserInfoService();

export class UserInfoController {

  /**
   * Summary: This method returns specific user info details based on user id.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getUserInfo(req, res) {
    var input = req.params.userId;

    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get specific user info based on id
      var output = await _userInfoService.getUserInfo(input);

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
   * Summary: This method is used to add user information
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async addUserInfo(req, res) {
    try {
      var input = req.body;
      var id = req.params.userId;

      // Validate input data
      if (input == null || !isValidString(input.title) || !isValidString(input.description))
        return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to create new user entry
      var output = await _userInfoService.addUserInfo(input, id);
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
        Messages.CREATED_SUCCESSFULLY
      );
    } catch (e) {
      // Send error message on fail
      return adminSendErrorResponse(res, 201, e);
    }
  }
}
