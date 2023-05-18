import messages from "../../utils/message";
import model from "../../models";
import { isValidInteger, isValidString } from "../../utils/validation";
import { adminServiceErrorResponse } from "../../utils/sendResponse";
const { user, userInfo } = model;
export class UserInfoService {

  /**
   * Summary: This method get specific user info details based on id and return it
   * @param {*} input
   * @returns
   */
  async getUserInfo(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";
      // Get a specific user details based on id
      output = await userInfo.findOne({
        where: { userId: input },
        include: [
          {
            model: user,
            as: "userDetails"
          }
        ]
      });

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method creates a new info
   * @param {*} input - This paramter contains parameter related to userInfo table
   * @param {*} id - This paramter contains userId
   */
  async addUserInfo(input, id) {
    try {
      var output = "";

      // Get user by id
      var userData = await user.findOne({ where: { id: id } });
      if (userData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      var userExists = await userInfo.findOne({ where: { userId: id } });

      // New user Info data object
      let newUserInfo = {
        userId: isValidInteger(id) ? id : 0,
        title: isValidString(input.title) ? input.title.trim() : "",
        description: isValidString(input.description) ? input.description.trim() : ""
      };

      if (!userExists) {
        output = await userInfo.create(newUserInfo);
      } else {
        output = await userInfo.update(newUserInfo, {
          where: { id: userExists.dataValues.id }
        });
      }

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }
}
