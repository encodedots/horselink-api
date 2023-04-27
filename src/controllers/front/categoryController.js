import { CategoryService } from "../../services/front/categoryService";
import Messages from "../../utils/message";
import {
  frontSendErrorResponse,
  frontSendSuccessResponse
} from "../../utils/sendResponse";

const _categoryService = new CategoryService();

export class CategoryController {
  /**
   * Summary: This method returns all categories.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getCategoryList(req, res) {
    try {
      // Call service to get all categories
      var output = await _categoryService.getCategoryList();

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
