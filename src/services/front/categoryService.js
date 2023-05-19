import model from "../../models";
import { frontServiceErrorResponse } from "../../utils/sendResponse";
const { category } = model;

export class CategoryService {
  /**
   * Summary: This method get all categories
   * @returns
   */
  async getCategoryList() {
    try {
      var output = "";
      output = await category.findAll({
        where: {
          isActive: "y",
          deletedAt: null
        }
      });

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }
}
