import { UserSocialMediaService } from "../../services/admin/userSocialMediaService";
import Messages from "../../utils/message";
import {
  adminSendErrorResponse,
  adminSendSuccessResponse
} from "../../utils/sendResponse";
import {
  isValidArray,
  isValidInteger,
  isValidString
} from "../../utils/validation";

const _userSocialMediaService = new UserSocialMediaService();

export class UserSocialMediaController {
  /**
   * Summary: This method is used to add data in user social media table
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async addUserSocialMedia(req, res) {
    try {
      var input = req.body;
      var id = req.params.userId;

      // Validate input data
      if (input == null || !isValidArray(input.socialMedias))
        return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to create new user social media entry
      var output = await _userSocialMediaService.addUserSocialMedia(input, id);
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
        Messages.UPDATED_USER_SUCCESSFULLY
      );
    } catch (e) {
      // Send error message on fail
      return adminSendErrorResponse(res, 201, e);
    }
  }

  /**
   * Summary: This method returns user social media details based on user id.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getUserSocialMedia(req, res) {
    var input = req.params.userId;

    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get specific user social media based on id
      var output = await _userSocialMediaService.getUserSocialMedia(input);

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
}
