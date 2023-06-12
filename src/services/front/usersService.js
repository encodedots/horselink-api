import model from "../../models";
import messages from "../../utils/message";
import {
  isEmptyObject,
  isValidInteger,
  isValidString
} from "../../utils/validation";
import { frontServiceErrorResponse } from "../../utils/sendResponse";
var slugify = require("../../utils/slugifyUrl");
import { hash } from "../../utils/hashing";
import Constants from "../../utils/constants";
import sendEmail from "../../utils/sendEmail";
const {
  user,
  userInfo,
  category,
  sponsors,
  saleHorse,
  userSocialMedia,
  userAuthTokens,
  socialMedia,
  countries,
  horseList,
  horseProduct,
  colorTemplate
} = model;
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
var mailchimp = require("../../utils/mailchimp");

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

      // Get a specific user details based on id
      output = await user.findOne({
        where: { webId: input, isActive: "y" }
      });

      if (output == null) return frontServiceErrorResponse(messages.NOT_FOUND);

      // Get is newsletter from the API
      var mailchimpRes = await mailchimp.getUserMailchimpData(output.email);
      if (mailchimpRes) {
        let isNewsLetter =
          mailchimpRes == Constants.MAILCHIMP_SUBSCRIBED_STATUS ? "y" : "n";
        if (output.isNewsLetter != isNewsLetter) {
          await user.update(
            { isNewsLetter: isNewsLetter },
            { where: { webId: output.webId } }
          );
          output = await user.findOne({ where: { webId: input } });
        }
      }

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
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method get all registered user
   * @returns
   */
  async getUserList(input, latitude, longitude) {
    try {
      var output = "";
      var whereObj = {};
      if (input.filter && input.filter.type != "all") {
        whereObj.name = input.filter.type;
      }

      // Get all user with pagination and filter
      output = await user.findAll({
        where: {
          isDeleted: "n",
          deletedAt: null,
          isActive: "y",
          status: "y"
        },
        include: [
          {
            model: category,
            as: "categoryDetails",
            where: whereObj
          },
          {
            model: countries,
            as: "countryDetails"
          }
        ],
        attributes: {
          include: [
            [
              model.sequelize.literal(
                `111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(latitude)) * COS(RADIANS(` +
                  latitude +
                  `)) * COS(RADIANS(longitude - ` +
                  longitude +
                  `)) + SIN(RADIANS(latitude)) * SIN(RADIANS(` +
                  latitude +
                  `)))))`
              ),
              "distance_in_km"
            ]
          ]
        },
        order:
          input.filter && input.filter.sort == "Closest"
            ? [["distance_in_km", "ASC"]]
            : [["id", "DESC"]],
        offset: parseInt(input.limit * (input.page - 1)),
        limit: parseInt(input.limit)
      });

      // Get count of all users based on filter
      var count = await user.count({
        where: {
          isDeleted: "n",
          deletedAt: null,
          isActive: "y",
          status: "y"
        },
        include: [
          {
            model: category,
            as: "categoryDetails",
            where: whereObj
          }
        ]
      });

      var pagesCount = Math.ceil(count / input.limit);
      var pages = isNaN(pagesCount) ? 0 : parseInt(pagesCount);

      // Return response
      return {
        records: output,
        totalCount: count,
        pageSize: input.limit,
        currentPage: input.page,
        pages: pages
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
        where: { userId: input },
        order: [["order", "asc"]]
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
      // Get a specific user details based on id
      output = await saleHorse.findAll({
        where: { userId: input, deletedAt: null },
        order: [["order", "asc"]]
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
      var horseListTitle = "";
      var socialMediaDetails = [];
      var contacts = false;
      var horseSalelink = "",
        horselistlink = "",
        sponsorLink = "",
        horseProductLink = "",
        horseProductListTitle = "";

      // Get a specific user details based on id
      output = await user.findOne({
        where: { id: input, isActive: "y" }
      });

      if (output == null) return frontServiceErrorResponse(messages.NOT_FOUND);

      if (output && output.country != null && output.telephone != null) {
        contacts = true;
      }
      // Get user details title based on id
      userInfoTitle = await userInfo.findOne({
        where: { userId: input }
      });

      // Get horse for sale details
      horseSaleTitle = await saleHorse.findOne({
        where: { userId: input }
      });

      if (
        horseSaleTitle?.description == "" ||
        (horseSaleTitle?.description == null &&
          horseSaleTitle?.titleLink != null)
      ) {
        horseSalelink = horseSaleTitle?.titleLink;
      }

      // Get horse list details
      horseListTitle = await horseList.findOne({
        where: { userId: input }
      });

      if (
        horseListTitle?.description == "" ||
        (horseListTitle?.description == null &&
          horseListTitle?.titleLink != null)
      ) {
        horselistlink = horseListTitle?.titleLink;
      }

      // Get sponsor details
      sponsorTitle = await sponsors.findOne({
        where: { userId: input }
      });

      if (
        sponsorTitle?.name == "" ||
        (sponsorTitle?.name == null && sponsorTitle?.titleLink != null)
      ) {
        sponsorLink = sponsorTitle?.titleLink;
      }

      horseProductListTitle = await horseProduct.findOne({
        where: { userId: input }
      });

      if (
        horseProductListTitle?.titleLink != null &&
        horseProductListTitle?.titleLink != ""
      ) {
        horseProductLink = horseProductListTitle?.titleLink;
      }
      // Get social media details
      socialMediaDetails = await userSocialMedia.findAll({
        where: { userId: input },
        order: [["id", "asc"]],
        include: [
          {
            model: socialMedia,
            as: "socialMediaDetails"
          }
        ]
      });

      titleArray.push(
        {
          slug: Constants.USER_INFO_TITLE,
          value: userInfoTitle ? userInfoTitle?.title : "",
          link: ""
        },
        {
          slug: Constants.HORSE_FOR_SALE_TITLE,
          value: horseSaleTitle ? horseSaleTitle?.title : "",
          link: horseSalelink
        },
        {
          slug: Constants.STALLIONS_TITLE,
          value: horseListTitle ? horseListTitle?.title : "",
          link: horselistlink
        },
        {
          slug: Constants.SPONSORS_TITLE,
          value: sponsorTitle ? sponsorTitle?.title : "",
          link: sponsorLink
        },
        {
          slug: Constants.SHOP_HORSE_TITLE,
          value: horseProductListTitle ? horseProductListTitle?.title : "",
          link: horseProductLink
        },
        {
          slug: Constants.SOCIAL_MEDIA_TITLE,
          value: socialMediaDetails ? socialMediaDetails : []
        }
      );

      // Return response
      return titleArray;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method get specific user details based on slug and return it
   * @param {*} input
   * @returns
   */
  async getUserBySlug(input) {
    try {
      // Validate input data
      if (input == null || !isValidString(input))
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";

      // Get a specific user details based in id
      output = await user.findOne({
        where: {
          userNameSlug: input,
          isActive: "y",
          isDeleted: "n",
          status: "y"
        },
        include: [
          {
            model: countries,
            as: "countryDetails"
          },
          {
            model: colorTemplate,
            as: "colorTemplateDetails"
          }
        ]
      });

      if (output == null)
        return frontServiceErrorResponse(messages.PROFILE_NOT_FOUND);

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method gets horse list detais based on userid and return it
   * @param {*} input
   * @returns
   */
  async getHorseList(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";
      // Get a specific horse list details based in id
      output = await horseList.findAll({
        where: { userId: input, deletedAt: null },
        order: [["order", "asc"]]
      });

      if (output == null) return frontServiceErrorResponse(messages.NOT_FOUND);

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method gets horse product list detais based on userid and return it
   * @param {*} input
   * @returns
   */
  async getHorseProductList(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";
      // Get a specific horse list details based in id
      output = await horseProduct.findAll({
        where: { userId: input, deletedAt: null }
      });

      if (output == null) return frontServiceErrorResponse(messages.NOT_FOUND);

      // Return response
      return output;
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

      // Get a specific user details based on id
      var userExist = await user.findOne({
        where: { webId: webId, isActive: "y", deletedAt: null }
      });
      if (userExist == null)
        return frontServiceErrorResponse(messages.NOT_FOUND);

      var updateArray = {};

      // Get user by username
      if (input.userName) {
        var userName = await user.findOne({
          where: {
            webId: {
              [Op.ne]: webId
            },
            userName: input.userName.trim()
          }
        });
        if (userName != null)
          return frontServiceErrorResponse(messages.USER_NAME_ALREADY_EXISTS);

        updateArray.userName = input.userName;
        updateArray.userNameSlug = input.userName;
      }

      // Get user by email address
      if (input.email) {
        if (userExist.email != input.email) {
          var userEmail = await user.findOne({
            where: {
              webId: {
                [Op.ne]: webId
              },
              email: input.email.trim()
            }
          });
          if (userEmail != null)
            return frontServiceErrorResponse(messages.EMAIL_USER_ALREADY_EXIST);

          var updatetempEmail = await user.update(
            { tempEmail: input.email.trim() },
            { where: { webId: webId } }
          );
          if (updatetempEmail == null)
            return frontServiceErrorResponse(messages.SOMETHING_WENT_WRONG);

          var subject = messages.EMAIL_SUBJECT_VERIFY_EMAIL_ADDRESS;
          let sendEmailData = {
            subject: subject,
            templateName: "user-email-verification-template.ejs",
            emailToUser: input.email.trim()
          };

          // Set data that needs to be replaced in email html
          let emailTemplateReplaceData = {};
          emailTemplateReplaceData["name"] = input.userName
            ? input.userName
            : userExist.userName
            ? userExist.userName
            : "There ";
          emailTemplateReplaceData["verifyEmailUrl"] =
            process.env.SITE_REDIRECT_URL +
            "/verify-user-email?email=" +
            input.email +
            "&webId=" +
            webId;

          sendEmail.generateHtmlForEmail(
            sendEmailData,
            emailTemplateReplaceData
          );
        }
      }
      if (input.password && isValidString(input.password)) {
        updateArray.password = hash(input.password.trim());
      }

      if (input.planName && isValidString(input.planName)) {
        updateArray.planName = input.planName.trim();
      }

      if (input.isNewsLetter && isValidString(input.isNewsLetter)) {
        var mailchimpStatus =
          input.isNewsLetter.trim() == "y"
            ? Constants.MAILCHIMP_SUBSCRIBED_STATUS
            : Constants.MAILCHIMP_UNSUBSCRIBED_STATUS;

        let postData = {
          email_address: userExist.email,
          status: mailchimpStatus,
          merge_fields: {
            FNAME: userExist.firstName,
            LNAME: userExist.lastName
          }
        };
        var mailchimpRes = await mailchimp.subscribedUnsubscribedmailchimpData(
          postData,
          true
        );
        if (mailchimpRes) {
          updateArray.isNewsLetter = input.isNewsLetter.trim();
        }
        console.log("mailchimpRes", mailchimpRes);
      }

      if (updateArray && !isEmptyObject(updateArray)) {
        output = await user.update(updateArray, { where: { webId: webId } });
      }

      var getUserDetails = await user.findOne({
        where: { webId: webId }
      });
      // Return response
      return {
        user: getUserDetails
      };
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method is used to update user email address based on the email.
   * @param {*} id - This parameter contains the user web id
   * @param {*} input - This parameter contains the user verify email
   * @returns
   */
  async verifyUpdateEmail(id, input) {
    try {
      // Validate input data
      if (!isValidString(id) || input == null || !isValidString(input.email))
        return frontServiceErrorResponse(messages.INVALID_PARAMETERS);

      // Get user based on webid
      var frontUser = await user.findOne({ where: { webId: id } });
      if (frontUser == null)
        return frontServiceErrorResponse(messages.USER_DOES_NOT_EXIST);

      var setEmailVerifiedDetail = {};
      let oldEmail = frontUser.email;

      if (frontUser.tempEmail == input.email) {
        // Set user as verified
        setEmailVerifiedDetail = {
          email: input.email,
          tempEmail: ""
        };

        var output = await user.update(setEmailVerifiedDetail, {
          where: { webId: id }
        });

        if (output == null)
          return frontServiceErrorResponse(messages.SOMETHING_WENT_WRONG);

        let updatedData = {
          email_address: input.email
        };
        await mailchimp.updateUserMailchimpData(oldEmail, updatedData);
      } else {
        return frontServiceErrorResponse(messages.INCORRECT_EMAIL);
      }
      var frontUser = await user.findOne({ where: { webId: id } });
      // Return response
      return {
        user: frontUser
      };
    } catch (e) {
      // Return error
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

      // Get a specific user details based on id
      var userExist = await user.findOne({
        where: { webId: webId, isActive: "y", deletedAt: null }
      });
      if (userExist == null)
        return frontServiceErrorResponse(messages.NOT_FOUND);

      // Delete user images
      this.deleteUserImage(userExist);

      // Delete specific user data based on id received in parameter
      var setData = {
        isDeleted: "y",
        originalFileName: "",
        originalFileUrl: "",
        croppedFileName: "",
        croppedFileUrl: "",
        backgroundOriginalFileName: "",
        backgroundOriginalFileUrl: "",
        backgroundCroppedFileName: "",
        backgroundCroppedFileUrl: ""
      };

      await user.update(setData, { where: { webId: webId } });
      var output = user.destroy({ where: { webId: webId } });

      if (output == null)
        return frontServiceErrorResponse(messages.SOMETHING_WENT_WRONG);

      await userAuthTokens.destroy({
        where: {
          email: userExist.email
        }
      });

      await mailchimp.deleteUserMailchimpData(userExist.email);

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method deletes user profile and background images from S3 bucket.
   * @param {*} userData
   * @param {*} isProfile
   * @param {*} isBackground
   * @returns
   */
  async deleteUserImage(userData) {
    try {
      // Delete profile image from s3 bucket
      if (
        userData.dataValues.originalFileName != "" &&
        userData.dataValues.originalFileName != null
      ) {
        // Delete original file from s3
        var deleteImageParams = {
          key: userData.dataValues.originalFileName
        };
        await deleteFileFromS3(deleteImageParams);
      }

      if (
        userData.dataValues.croppedFileName != "" &&
        userData.dataValues.croppedFileName != null
      ) {
        // Delete cropped file from s3
        var deleteCroppedImageParams = {
          key: userData.dataValues.croppedFileName
        };
        await deleteFileFromS3(deleteCroppedImageParams);
      }

      // Delete background image from s3 bucket
      if (
        userData.dataValues.backgroundOriginalFileName != "" &&
        userData.dataValues.backgroundOriginalFileName != null
      ) {
        // Delete background original file from s3
        var deleteImageParams = {
          key: userData.dataValues.backgroundOriginalFileName
        };
        await deleteFileFromS3(deleteImageParams);
      }

      if (
        userData.dataValues.backgroundCroppedFileName != "" &&
        userData.dataValues.backgroundCroppedFileName != null
      ) {
        // Delete background cropped file from s3
        var deleteCroppedImageParams = {
          key: userData.dataValues.backgroundCroppedFileName
        };
        await deleteFileFromS3(deleteCroppedImageParams);
      }

      // Return response data
      return true;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }
}
