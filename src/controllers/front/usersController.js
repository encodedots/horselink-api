import { UserService } from "../../services/front/usersService";
import Messages from "../../utils/message";
import {
  frontSendErrorResponse,
  frontSendSuccessResponse
} from "../../utils/sendResponse";
import { isValidInteger } from "../../utils/validation";

const _userService = new UserService();

export class UsersController {
  //#region GET APIs

  /**
   * Summary: This method returns specific user's detail based on id.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getUser(req, res) {
    var input = req.params.id;

    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get specific user based in input
      var output = await _userService.getUser(input);

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

  /**
   * Summary: This method returns specific user info detail based on user id.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getUserInfo(req, res) {
    var input = req.params.userId;

    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get specific user info based in input
      var output = await _userService.getUserInfo(input);

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

  /**
   * Summary: This method returns all registered user.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getUserList(req, res) {
    try {
      var input = req.query;
      // Call service to get all users
      var output = await _userService.getUserList(input);

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

  /**
   * Summary: This method returns sponsor details of user based on id
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getSponsorDetails(req, res) {
    var input = req.params.id;

    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get sponsor details based on id
      var output = await _userService.getSponsorDetails(input);
      if (output && output["status"] == false)
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

  /**
   * Summary: This method returns horse sale detail of user based on id
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getSaleHorseDetails(req, res) {
    var input = req.params.id;

    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get horse sale based on id
      var output = await _userService.getSaleHorseDetails(input);
      if (output && output["status"] == false)
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

  /**
   * Summary: This method returns user social media details based on user id.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getUserSocialMediaDetails(req, res) {
    var input = req.params.id;
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get specific user social media based on id
      var output = await _userService.getUserSocialMediaDetails(input);

      if (output && output["status"] == false)
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

  /**
   * Summary: This method returns user get titles based on user id.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getTitles(req, res) {
    var input = req.params.userId;
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get specific user profiles title based on id
      var output = await _userService.getTitles(input);

      if (output && output["status"] == false)
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
  //#endregion GET APIs
}
