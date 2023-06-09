import { UserService } from "../../services/front/usersService";
import Messages from "../../utils/message";
import {
  frontSendErrorResponse,
  frontSendSuccessResponse
} from "../../utils/sendResponse";
import {
  isValidInteger,
  isEmptyObject,
  isValidString
} from "../../utils/validation";
import Constants from "../../utils/constants";
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
      if (input == null || !isValidString(input))
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get specific user based in input
      var output = await _userService.getUser(input);
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
   * Summary: This method returns all registered user.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getUserList(req, res) {
    try {
      var input = req.query;

      var latitude = req.headers.latitude
        ? req.headers.latitude
        : Constants.LATITUDE;
      var longitude = req.headers.longitude
        ? req.headers.longitude
        : Constants.LONGITUDE;
      // Call service to get all users
      var output = await _userService.getUserList(input, latitude, longitude);

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

  /**
   * Summary: This method returns horse list based on user id
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getHorseList(req, res) {
    var input = req.params.id;

    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get horse sale based on id
      var output = await _userService.getHorseList(input);
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
   * Summary: This method returns horse product list based on user id
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getHorseProductList(req, res) {
    var input = req.params.id;

    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get horse sale based on id
      var output = await _userService.getHorseProductList(input);
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
   * Summary: This method returns specific user's detail based on slug.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getUserBySlug(req, res) {
    var input = req.params.userNameSlug;

    try {
      // Validate input data
      if (input == null || !isValidString(input))
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get specific user based in input
      var output = await _userService.getUserBySlug(input);
      if (output && output["status"] == false)
        return frontSendErrorResponse(res, 201, output["error"], output["data"]);

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

  //#region POST APIs

  /**
   * Summary: This method update the user details based on id
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async updateUserDeatils(req, res) {
    var webId = req.params.id;
    var input = req.body;

    try {
      // Validate input data
      if (input == null || isEmptyObject(input) || !isValidString(webId))
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to update the user details based on id
      var output = await _userService.updateUserDeatils(webId, input);
      if (output && output["status"] == false)
        return frontSendErrorResponse(res, 201, output["error"]);

      // Return response data
      return frontSendSuccessResponse(
        res,
        200,
        output,
        Messages.UPDATED_USER_SUCCESSFULLY
      );
    } catch (e) {
      return frontSendErrorResponse(res, 201, e);
    }
  }

  /**
   * Summary: This method is used to verify/update the user email address in the system.
   * @param {*} req
   * @param {*} res
   */
  async verifyUpdateEmail(req, res) {
    var id = req.params.id;
    var input = req.body;

    try {
      // Validate input data
      if (!isValidString(id) || input == null || !isValidString(input.email))
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to verify specific user email address based on token
      var output = await _userService.verifyUpdateEmail(id, input);
      if (output == null)
        return frontSendErrorResponse(res, 201, Messages.SOMETHING_WENT_WRONG);

      if (output["status"] == false)
        return frontSendErrorResponse(res, 201, output["error"]);

      // Return response
      return frontSendSuccessResponse(
        res,
        200,
        output,
        Messages.USER_EMAIL_UPDATED_SUCCESSFULLY
      );
    } catch (e) {
      // Return error
      return frontSendErrorResponse(res, 201, e);
    }
  }
  //#endregion POST APIs

  //#region DELETE APIs
  /**
   * Summary: This method delete the user based on id
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async deleteUser(req, res) {
    var webId = req.params.id;

    try {
      // Validate input data
      if (webId == null || !isValidString(webId))
        return frontSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to delete the user based on id
      var output = await _userService.deleteUser(webId);
      if (output == null)
        return frontSendErrorResponse(res, 201, Messages.SOMETHING_WENT_WRONG);

      if (output["status"] == false)
        return frontSendErrorResponse(
          res,
          201,
          output["error"],
          output["data"]
        );

      // Return response data
      return frontSendSuccessResponse(
        res,
        200,
        output,
        Messages.DELETED_SUCCESSFULLY
      );
    } catch (e) {
      return frontSendErrorResponse(res, 201, e);
    }
  }
  //#endregion DELETE APIs
}
