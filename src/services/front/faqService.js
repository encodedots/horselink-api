import messages from "../../utils/message";
import model from "../../models";
import { isValidInteger, isValidString } from "../../utils/validation";
import { frontServiceErrorResponse } from "../../utils/sendResponse";
import constants from "../../utils/constants";
const { QueryTypes, Sequelize } = require("sequelize");
const { faqManagement } = model;

export class FaqService {
  /**
   * Summary: This method get all faq list
   * @returns
   */
  async getFaqList() {
    try {
      var output = "";
      output = await faqManagement.findAll({
        where: {
          deletedAt: null
        }
      });
      if (output == null) return frontServiceErrorResponse(messages.NOT_FOUND);

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }
}
