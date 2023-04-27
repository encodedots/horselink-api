import { SaleHorseService } from "../../services/admin/saleHorseService";
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

const _saleHorseService = new SaleHorseService();

export class SaleHorseController {
  /**
   * Summary: This method is used to add information in sale horse table
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async addHorseForSale(req, res) {
    try {
      var input = req.body;
      var id = req.params.userId;
      // Validate input data
      if (
        input == null ||
        !isValidString(input.title) ||
        !isValidArray(input.descriptions)
      )
        return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to create new user entry
      var output = await _saleHorseService.addHorseForSale(id, input);
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

  //#region GET APIs

  /**
   * Summary: This method returns specific user's detail based on id.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getSaleHorseDetails(req, res) {
    var input = req.params.userId;

    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminSendErrorResponse(res, 201, Messages.INVALID_PARAMETERS);

      // Call service to get specific user based on id
      var output = await _saleHorseService.getSaleHorseDetails(input);
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
