import model from "../../models";
import messages from "../../utils/message";
import { isEmptyObject, isValidInteger, isValidString } from "../../utils/validation";
import { frontServiceErrorResponse } from "../../utils/sendResponse";
var slugify = require("../../utils/slugifyUrl");
import { hash } from "../../utils/hashing";
import Constants from "../../utils/constants";
const { user, userInfo, category, sponsors, saleHorse, userSocialMedia, socialMedia } = model;
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

export class UserService {
  /**
   * Summary: This method gets specific user details based on id and return it
   * @param {*} input
   * @returns
   */
  async getUser(input) {
    try {
      // Validate input data
      if (input == null || !isValidString(input))
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";

      // Get a specific user details based in id
      output = await user.findOne({
        where: { webId: input }
      });

      if (output == null) return frontServiceErrorResponse(messages.NOT_FOUND);

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method gets specific user info details based on id and return it
   * @param {*} input
   * @returns
   */
  async getUserInfo(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";

      // Get a specific user details based in id
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
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method get all registered user
   * @returns
   */
  async getUserList(input) {
    try {
      var output = "";
      var whereObj = {};
      if (input.filter && input.filter.type) {
        whereObj.name = input.filter.type;
      }
      // Get all user with pagination and filter
      output = await user.findAll({
        where: {
          isActive: "y",
          deletedAt: null
        },
        include: [
          {
            model: category,
            as: "categoryDetails",
            where: whereObj
          }
        ],
        order: [["id", "DESC"]],
        offset: parseInt(input.limit * (input.page - 1)),
        limit: parseInt(input.limit)
      });

      // Get count of all users based on filter
      var count = await user.count({
        where: {
          isActive: "y",
          deletedAt: null
        },
        include: [
          {
            model: category,
            as: "categoryDetails",
            where: whereObj
          }
        ]
      });

      // Return response
      return {
        records: output,
        totalCount: count,
        pageSize: input.limit,
        currentPage: input.page
      };
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method gets sponsor details based on userid and return it
   * @param {*} input
   * @returns
   */
  async getSponsorDetails(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";
      // Get a sponsor details based on id
      output = await sponsors.findAll({
        where: { userId: input }
      });

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method gets sale horse details based on userid and return it
   * @param {*} input
   * @returns
   */
  async getSaleHorseDetails(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";
      // Get a specific user details based in id
      output = await saleHorse.findAll({
        where: { userId: input }
      });

      if (output == null) return frontServiceErrorResponse(messages.NOT_FOUND);

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method get user social media details based on user id and return it
   * @param {*} input
   * @returns
   */
  async getUserSocialMediaDetails(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

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
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method get user title based on user id and return it
   * @param {*} input
   * @returns
   */
  async getTitles(input) {
    try {
      var titleArray = [];
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";
      var userInfoTitle = "";
      var horseSaleTitle = "";
      var sponsorTitle = "";
      var socialMediaDetails = [];
      var contacts = false;

      // Get a specific user details based in id
      output = await user.findOne({
        where: { id: input }
      });

      if (output == null) return frontServiceErrorResponse(messages.NOT_FOUND);

      if (output && output.country != null && output.telephone != null) {
        contacts = true;
      }
      // Get user details title based on id
      userInfoTitle = await userInfo.findOne({
        where: { userId: input }
      });

      horseSaleTitle = await saleHorse.findOne({
        where: { userId: input }
      });

      sponsorTitle = await sponsors.findOne({
        where: { userId: input }
      });

      socialMediaDetails = await userSocialMedia.findAll({
        where: { userId: input },
        include: [
          {
            model: socialMedia,
            as: "socialMediaDetails"
          }
        ]
      });

      titleArray.push({
        [Constants.USER_INFO_TITLE]: userInfoTitle ? userInfoTitle?.title : "",
        [Constants.HORSE_FOR_SALE_TITLE]: horseSaleTitle
            ? horseSaleTitle?.title
            : "",
        [Constants.SPONSORS_TITLE]: sponsorTitle ? sponsorTitle?.title : "",
        [Constants.SOCIAL_MEDIA_TITLE]: socialMediaDetails,
        [Constants.CONTACTS_TITLE]: contacts
      });
      // Return response
      return titleArray;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method update the user details based on the userid and return it
   * @param {*} input
   * @returns
   */
  async updateUserDeatils(webId, input) {
    try {
      // Validate input data
      if (input == null || !isValidString(webId))
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";

      // Get a specific user details based in id
      var userExist = await user.findOne({ where: { webId: webId, isActive: "y", deletedAt: null } });
      if (userExist == null)
        return frontServiceErrorResponse(messages.NOT_FOUND);

      var updateArray = {}

      // Get user by username
      if (input.userName) {
        var userName = await user.findOne({ where: { userName: input.userName.trim() } });
        if (userName != null)
          return frontServiceErrorResponse(messages.USER_NAME_ALREADY_EXISTS);

        var userSlug = await slugify.slugifyUsername(input.userName);
        updateArray.userName = input.userName
        updateArray.userNameSlug = userSlug
      }

      // Get user by email address
      if (input.email) {
        var userEmail = await user.findOne({ where: { email: input.email.trim() } });
        if (userEmail != null)
          return frontServiceErrorResponse(messages.EMAIL_USER_ALREADY_EXIST);

        updateArray.email = input.email
      }

      if (input.password && isValidString(input.password)) {
        updateArray.password = hash(input.password.trim())
      }

      if (input.planName && isValidString(input.planName)) {
        updateArray.planName = input.planName.trim()
      }

      if (updateArray && !isEmptyObject(updateArray)) {
        output = await user.update(updateArray, { where: { webId: webId } });
      }

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method delete the user based on the userid
   * @param {*} input
   * @returns
   */
  async deleteUser(webId) {
    try {
      // Validate input data
      if (webId == null || !isValidString(webId))
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";

      // Get a specific user details based in id
      var userExist = await user.findOne({ where: { webId: webId, isActive: "y", deletedAt: null } });
      if (userExist == null)
        return frontServiceErrorResponse(messages.NOT_FOUND);

      // Delete user
      await user.update({ isDeleted: "y" }, { where: { webId: webId } });
      var output = user.destroy({ where: { webId: webId } });

      if (output == null)
        return frontServiceErrorResponse(messages.SOMETHING_WENT_WRONG);

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }
}
