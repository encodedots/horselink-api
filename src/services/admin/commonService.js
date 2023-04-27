import model from "../../models";
import { adminServiceErrorResponse } from "../../utils/sendResponse";
const { countries, userType, user } = model;

export class CommonService {
  /**
   * Summary: This method is used to get all active country list.
   * @returns
   */
  async getCountries() {
    try {
      // Get all countries list
      var output = await countries.findAll({
        where: { isActive: "y", isDeleted: "n" },
        order: [["name", "ASC"]]
      });

      // Return response
      return output;
    } catch (e) {
      // Return error response
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method get all user types
   * @returns
   */
  async getUserTypesList() {
    try {
      var output = "";
      output = await userType.findAll({
        where: {
          isActive: "y",
          deletedAt: null
        }
      });

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }
}
