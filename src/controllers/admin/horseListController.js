import { HorseListService } from "../../services/admin/horseListService";
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

const _horseListService = new HorseListService();

export class HorseListController {
  /**
   * Summary: This method is used to add information in horse list table
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async addHorseList(req, res) {
    try {
      var input = req.body;
      var id = req.params.userId;
      var inputFiles = req.files;

      // Validate input data
      if (input.details && !isValidArray(input.details) && input.title && !isValidString(input.title))
        return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to add/update user horse entry
      var output = await _horseListService.addHorseList(id, input, inputFiles);
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
      console.log("e", e)
      return adminSendErrorResponse(res, 201, e);
    }
  }

  //#region GET APIs

  /**
   * Summary: This method returns specific user's horse detail based on id.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getHorseListDetails(req, res) {
    var input = req.params.userId;

    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get specific user based on id
      var output = await _horseListService.getHorseListDetails(input);
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
  //#endregion GET APIs
}
