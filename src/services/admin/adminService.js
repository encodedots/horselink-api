import { hash, hash_compare } from "../../utils/hashing";
import messages from "../../utils/message";
import model from "../../models";
import { isValidString } from "../../utils/validation";
import { adminServiceErrorResponse } from "../../utils/sendResponse";

const { adminUser, userAuthTokens } = model;

export class AdminService {
  //#region POST APIs

  /**
   * Summary: This method checks for valid login user and creates new token for valid user.
   * @param {*} input - Valid email and password checks for admin
   * @returns
   */
  async login(input) {
    try {
      // Validate input
      if (
        input == null ||
        (input &&
          (!isValidString(input.email) || !isValidString(input.password)))
      )
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = {};

      // Get information for user if valid otherwise send error
      const adminUserDetails = await adminUser.findOne({
        where: { email: input.email }
      });

      if (!adminUserDetails)
        return adminServiceErrorResponse(messages.INCORRECT_LOGIN_CREDENTIALS);

      const checkPassword = hash_compare(
        hash(input.password),
        adminUserDetails.password
      );
      if (!checkPassword)
        return adminServiceErrorResponse(messages.INCORRECT_LOGIN_CREDENTIALS);

      if (adminUserDetails.isActive !== "y")
        return adminServiceErrorResponse(messages.ACCOUNT_SUSPENDED);

      if (adminUserDetails.isDeleted !== "n")
        return adminServiceErrorResponse(messages.ACCOUNT_DELETED);

      output.user = adminUserDetails;

      // Create new authentication token
      output.token = await adminUserDetails.generateJWT();

      // await adminUser.update({
      //     token: output.token,
      //     lastLoginAt: new Date()
      // }, { where: { id: adminUserDetails.dataValues.id } });

      var newToken = {
        email: adminUserDetails.email,
        token: output.token
      };

      await userAuthTokens.create(newToken);

      if (output == null)
        return adminServiceErrorResponse(messages.SOMETHING_WENT_WRONG);

      // Return output
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method checks for user logout and delete token for valid user.
   * @param {*} input - This parameter contains admin user email
   */
  async logout(input) {
    try {
      if (input == null || (input && !isValidString(input.email)))
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      var checkEmailExists = await adminUser.findOne({
        where: { email: input.email }
      });
      if (checkEmailExists == null) {
        return adminServiceErrorResponse(messages.NOT_FOUND);
      }
      await adminUser.update({ token: "" }, { where: { email: input.email } });

      return true;
    } catch (error) {
      return adminServiceErrorResponse(error);
    }
  }

  //#endregion POST APIs
}
