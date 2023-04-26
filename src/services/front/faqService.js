import messages from "../../utils/message";
import model from "../../models";
import { frontServiceErrorResponse } from "../../utils/sendResponse";
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

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }
}
