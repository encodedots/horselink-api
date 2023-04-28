import messages from "../../utils/message";
import model from "../../models";
import { isValidInteger, isValidString } from "../../utils/validation";
import { adminServiceErrorResponse } from "../../utils/sendResponse";
const { user, userSocialMedia, socialMedia } = model;
export class UserSocialMediaService {
  /**
   * Summary: This method creates a new user social media
   * @param {*} input - This paramter contains parameter related to user social media table
   * @param {*} id - This paramter contains userId
   */
  async addUserSocialMedia(input, id) {
    try {
      var output = "";

      // Get user by id
      var userData = await user.findOne({ where: { id: id } });
      if (userData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      await userSocialMedia.destroy({ where: { userId: id } });

      var socialMediaArr = [];
      if (input.socialMedias && input.socialMedias.length > 0) {
        let data = input.socialMedias;
        data.forEach((element) => {
          // New object for social media details
          if (element.socialMediaId != "" && element.link != "") {
            let newData = {
              userId: isValidInteger(id) ? id : 0,
              socialMediaId: isValidInteger(element.socialMediaId)
                ? element.socialMediaId
                : 0,
              link: isValidString(element.link) ? element.link.trim() : ""
            };
            socialMediaArr.push(newData);
          }
        });
      }
      output = await userSocialMedia.bulkCreate(socialMediaArr);
      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method get user social media details based on user id and return it
   * @param {*} input
   * @returns
   */
  async getUserSocialMedia(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";
      // Get a user social media details based on id
      output = await userSocialMedia.findAll({
        where: { userId: input },
        include: [
          {
            model: socialMedia,
            as: "socialMediaDetails"
          }
        ]
      });

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }
}
