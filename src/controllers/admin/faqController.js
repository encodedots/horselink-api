import { FaqService } from "../../services/admin/faqService";
import messages from "../../utils/message";
import { adminSendSuccessResponse, adminSendErrorResponse } from "../../utils/sendResponse";
import { isValidString, isValidInteger } from "../../utils/validation";

const _faqService = new FaqService();

export class FaqController {

  /**
   * Summary: This method is used to get all faq
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getFaqList(req, res) {
    var input = req.query;

    try {
      // Call service to get users
      var output = await _faqService.getFaqList(input);

      if (output && output["status"] == false)
        return adminSendErrorResponse(res, 201, output["error"]);

      // Return response data
      return adminSendSuccessResponse(
        res,
        200,
        output,
        messages.RETRIEVE_SUCCESSFULLY
      );
    } catch (e) {
      // Send error message on fail
      return adminSendErrorResponse(res, 201, e);
    }
  }

  /**
   * Summary: This method returns specific faq's detail based on id.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getFaqDetails(req, res) {
    var input = req.params.id;

    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Call service to get specific faq based on input
      var output = await _faqService.getFaqDetails(input);

      if (output && output["status"] == false) {
        return adminSendErrorResponse(res, 201, output["error"]);
      }

      // Return response data
      return adminSendSuccessResponse(
        res,
        200,
        output,
        messages.RETRIEVE_SUCCESSFULLY
      );
    } catch (e) {
      return adminSendErrorResponse(res, 201, e);
    }
  }

  /**
   * Summary: This method is used to add faq details.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async addFaqDetails(req, res) {
    try {
      var input = req.body;

      // Validate input data
      if (input == null || !isValidString(input.title) || !isValidString(input.description) || !isValidString(input.module))
        return adminSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);


      // Call service to create new faq entry
      var output = await _faqService.addFaqDetails(input);
      if (output == null)
        return adminSendErrorResponse(res, 201, messages.SOMETHING_WENT_WRONG);

      if (output && output["status"] == false)
        return adminSendErrorResponse(res, 201, output["error"]);

      // Return response data
      return adminSendSuccessResponse(
        res,
        200,
        output,
        messages.CREATED_FAQ_SUCCESSFULLY
      );
    } catch (e) {
      // Send error message on fail
      return adminSendErrorResponse(res, 201, e);
    }
  }

  /**
   * Summary: This method is used to update faq details.
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async updateFaqDetails(req, res) {
    try {
      var input = req.body;
      var id = req.params.id;

      // Validate input data
      if (input == null || !isValidString(input.title) || !isValidString(input.description))
        return adminSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Call service to update the faq details
      var output = await _faqService.updateFaqDetails(id, input);
      if (output == null)
        return adminSendErrorResponse(res, 201, messages.SOMETHING_WENT_WRONG);

      if (output && output["status"] == false)
        return adminSendErrorResponse(res, 201, output["error"]);

      // Return response data
      return adminSendSuccessResponse(
        res,
        200,
        output,
        messages.UPDATED_FAQ_SUCCESSFULLY
      );
    } catch (e) {
      // Send error message on fail
      return adminSendErrorResponse(res, 201, e);
    }
  }

  /**
   * Summary: This method is used to update faq status
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async updateFaqStatus(req, res) {
    var status = req.body.status;
    var id = req.params.id;
    try {

      // Call service to update the faq status
      var output = await _faqService.updateFaqStatus(id, status);

      if (output && output["status"] == false)
        return adminSendErrorResponse(res, 201, output["error"]);

      // Return response data
      return adminSendSuccessResponse(
        res,
        200,
        output,
        messages.UPDATED_SUCCESSFULLY
      );
    } catch (e) {
      // Send error message on fail
      return adminSendErrorResponse(res, 201, e);
    }
  }

  /**
   * Summary: This method is used to delete faq details
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async deleteFaqDetails(req, res) {
    try {
      var id = req.params.id;

      if (!isValidInteger(id) || id < 1)
        return adminSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Call service to delete faq details
      var output = await _faqService.deleteFaqDetails(id);

      if (output && output["status"] == false)
        return adminSendErrorResponse(res, 201, output["error"]);

      // Return response data
      return adminSendSuccessResponse(
        res,
        200,
        output,
        messages.DELETED_SUCCESSFULLY
      );
    } catch (e) {
      // Send error message on fail
      return adminSendErrorResponse(res, 201, e);
    }
  }
}
