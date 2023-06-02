import { SaleHorseService } from "../../services/front/saleHorseService";
import Messages from "../../utils/message";
import {
  frontSendErrorResponse,
  frontSendSuccessResponse
} from "../../utils/sendResponse";

const _saleHorseService = new SaleHorseService();

export class SaleHorseController {
  /**
   * Summary: This method returns all get all horse category.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getHorseCategory(req, res) {
    try {
      // Call service to get all horse category
      var output = await _saleHorseService.getHorseCategory();

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
   * Summary: This method returns all horse list.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getHorseList(req, res) {
    try {
      var input = req.query;
      // Call service to get all users
      var output = await _saleHorseService.getHorseList(input);

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
   * Summary: This method returns all horse list or user list.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getUserHorseList(req, res) {
    try {
      var input = req.params.type;
      // Call service to get all users or horse list
      var output = await _saleHorseService.getUserHorseList(input);

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
}
