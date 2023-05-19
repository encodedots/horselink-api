import { AdminService } from "../../services/admin/adminService";
import messages from "../../utils/message";
import { adminSendErrorResponse, adminSendSuccessResponse } from "../../utils/sendResponse";
import { isValidString } from "../../utils/validation";

const _adminUserService = new AdminService();

export class AdminUserController {

  //#region POST APIs

  /**
   * This function is used for the admin login
   * This function will create authenticatin token which will be return to front end to access authorised API
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async login(req, res) {
    var input = req.body;

    try {
      // Validate input data
      if (input == null || (input && (!isValidString(input.email) || !isValidString(input.password))))
        return adminSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      var output = "";

      // Call service to get login user token and details
      output = await _adminUserService.login(input);
      if (output == null)
        return adminSendErrorResponse(res, 201, messages.NOT_FOUND);

      if (output["status"] == false)
        return adminSendErrorResponse(res, 201, output["error"]);

      // Return response
      return adminSendSuccessResponse(
        res,
        200,
        {
          token: output.token,
          user: {
            id: output.user.id,
            name: output.user.name,
            email: output.user.email
          }
        },
        messages.LOGIN_SUCCESSFULLY
      );
    } catch (e) {
      return adminSendErrorResponse(res, 201, e);
    }
  }

  /**
   * This function is used for the sign out admin from the admin panel
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async logout(req, res) {
    var input = req.body;
    try {
      // Validate input data
      if (input == null || !isValidString(input.email))
        return adminSendErrorResponse(res, 201, messages.INVALID_PARAMETERS);

      // Call sevice to logout user from the system
      var output = await _adminUserService.logout(input);
      if (output == null)
        return adminSendErrorResponse(res, 201, messages.SOMETHING_WENT_WRONG);

      if (output["status"] == false)
        return adminSendErrorResponse(res, 201, output["error"]);

      // Return response
      return adminSendSuccessResponse(
        res,
        200,
        output,
        messages.LOGOUT_SUCCESSFULLY
      );
    } catch (e) {
      // Return error
      return adminSendErrorResponse(res, 201, e);
    }
  }

  //#endregion POST APIs
}
