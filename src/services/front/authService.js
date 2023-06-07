import model from "../../models";
import constants from "../../utils/constants";
import { hash, hash_compare } from "../../utils/hashing";
import message from "../../utils/message";
const { user, userAuthTokens } = model;
import { frontServiceErrorResponse } from "../../utils/sendResponse";
import { isValidString } from "../../utils/validation";
import md5 from "md5";
import sendEmail from "../../utils/sendEmail";
import random from "../../utils/random";
const jwt = require("jsonwebtoken");
var slugify = require("../../utils/slugifyUrl");
var refreshTokens = [];
var mailchimp = require("../../utils/mailchimp");

export class AuthService {
  /**
   * Summary: This method gets specific user details based on email, manage login and return token.
   * @param {*} input
   * @returns
   */
  async login(input) {
    try {
      // Validate input data
      if (
        input == null ||
        (input &&
          (!isValidString(input.userName) || !isValidString(input.password)))
      )
        return frontServiceErrorResponse(message.INVALID_PARAMETERS);

      // Get information for user if valid otherwise send error
      const frontUserDetails = await user.findOne({
        where: { userName: input.userName }
      });

      if (!frontUserDetails)
        return frontServiceErrorResponse(message.USER_DOES_NOT_EXIST);

      // Check if user is active
      if (frontUserDetails.isActive !== "y")
        return frontServiceErrorResponse(message.ACCOUNT_DEACTIVATED);

      // Check if user details are deleted, As we do soft delete it will have y/n flag here
      if (frontUserDetails.isDeleted !== "n")
        return frontServiceErrorResponse(message.ACCOUNT_DELETED);

      // Compare user password
      const checkPassword = hash_compare(
        hash(input.password),
        frontUserDetails.password
      );
      if (!checkPassword)
        return frontServiceErrorResponse(message.INCORRECT_LOGIN_CREDENTIALS);

      if (frontUserDetails.status && frontUserDetails.status !== "y") {
        return frontServiceErrorResponse(message.VERIFY_ACCOUNT);
      }

      // Generate an access token
      // If this token is stolen, then they will have access to the account forever and the actual user won't be able to revoke access.
      // To prevent that, we sets expiration time so the token expire after a specific period.
      var expireTime = "24h";
      var token = jwt.sign(
        {
          _id: frontUserDetails.dataValues.id,
          email: frontUserDetails.dataValues.email
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: expireTime }
      );

      var newToken = {
        email: frontUserDetails.dataValues.email,
        token: token
      };

      await userAuthTokens.create(newToken);

      // Generate an refresh token
      // We are managing refresh token, so that is user token get expired while he/she is working, we can renew the token to prevent data/work loss for user.
      // This is used to increase usability without damaging any data. The actual token will expire after specific time. After that refresh token will be used to renew it.
      var refreshToken = jwt.sign(
        {
          _id: frontUserDetails.dataValues.id,
          email: frontUserDetails.dataValues.email
        },
        process.env.JWT_REFRESH_SECRET_KEY
      );
      refreshTokens.push(refreshToken);

      const loginUserDetails = await user.findOne({
        where: { id: frontUserDetails.id }
      });

      // Return response
      return {
        token: token,
        refreshToken: refreshToken,
        user: loginUserDetails
      };
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method register new user in the system
   * @param {*} input
   * @returns
   */
  async register(input) {
    try {
      // Validate input data
      if (
        input == null ||
        !isValidString(input.userName) ||
        !isValidString(input.email) ||
        !isValidString(input.password) ||
        !isValidString(input.firstName) ||
        !isValidString(input.lastName) ||
        !isValidString(input.planName) ||
        !isValidString(input.isNewsLetter)
      )
        return frontServiceErrorResponse(message.INVALID_PARAMETERS);

      const regex = new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/
      );
      var passwordValid = await regex.test(input.password);
      if (!passwordValid) {
        return frontServiceErrorResponse(message.PASSWORD_VALIDATION_ERROR);
      }
      // Get user by username
      var userName = await user.findOne({
        where: { userName: input.userName.trim() }
      });
      if (userName != null)
        return frontServiceErrorResponse(message.USER_NAME_ALREADY_EXISTS);

      // Get user by email address
      var userEmail = await user.findOne({
        where: { email: input.email.trim() }
      });
      if (userEmail != null)
        return frontServiceErrorResponse(message.EMAIL_USER_ALREADY_EXIST);

      var userSlug = await slugify.slugifyUsername(input.userName);

      // New user data object
      let newUser = {
        webId: md5(Date.now()).toString(),
        firstName: isValidString(input.firstName) ? input.firstName.trim() : "",
        lastName: isValidString(input.lastName) ? input.lastName.trim() : "",
        userName: isValidString(input.userName) ? input.userName.trim() : "",
        userNameSlug: userSlug ? userSlug.trim() : "",
        email: isValidString(input.email) ? input.email.trim() : "",
        password: isValidString(input.password)
          ? hash(input.password.trim())
          : "",
        planName: isValidString(input.planName) ? input.planName.trim() : "",
        isNewsLetter: isValidString(input.isNewsLetter)
          ? input.isNewsLetter.trim()
          : "",
        isActive: "y"
      };

      var output = await user.create(newUser);

      // Generate an access token
      // If this token is stolen, then they will have access to the account forever and the actual user won't be able to revoke access.
      // To prevent that, we sets expiration time so the token expire after a specific period.
      var expireTime = "24h";
      var token = jwt.sign(
        {
          _id: output.dataValues.id,
          email: output.dataValues.email
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: expireTime }
      );

      // Generate an refresh token
      // We are managing refresh token, so that is user token get expired while he/she is working, we can renew the token to prevent data/work loss for user.
      // This is used to increase usability without damaging any data. The actual token will expire after specific time. After that refresh token will be used to renew it.
      var refreshToken = jwt.sign(
        {
          _id: output.dataValues.id,
          email: output.dataValues.email
        },
        process.env.JWT_REFRESH_SECRET_KEY
      );
      refreshTokens.push(refreshToken);

      const loginUserDetails = await user.findOne({ where: { id: output.id } });

      if (input.isNewsLetter == "y") {
        let postData = {
          email_address: output.dataValues.email, //janvi+3.encodedots@gmail.com
          status: constants.MAILCHIMP_SUBSCRIBED_STATUS,
          merge_fields: {
            FNAME: output.dataValues.firstName,
            LNAME: output.dataValues.lastName
          }
        };
        await mailchimp.subscribedUnsubscribedmailchimpData(postData, true);
      }

      let sendEmailData = {
        subject: message.EMAIL_SUBJECT_VERIFY_ACCOUNT,
        templateName: "user-account-verification-template.ejs",
        emailToUser: output.dataValues.email
      };

      // Set data that needs to be replaced in email html
      let emailTemplateReplaceData = {};
      emailTemplateReplaceData["userName"] = output.dataValues.userName;
      emailTemplateReplaceData["verifyEmailUrl"] =
        process.env.SITE_REDIRECT_URL +
        "/auth/sign-in?webId=" +
        output.dataValues.webId;

      sendEmail.generateHtmlForEmail(sendEmailData, emailTemplateReplaceData);

      // Return response
      return {
        token: token,
        refreshToken: refreshToken,
        user: loginUserDetails
      };
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method is used to check the username and email is unique or not
   * @param {*} input
   * @returns
   */
  async checkEmailUserName(input) {
    try {
      // Validate input data
      if (
        input == null ||
        !isValidString(input.userName) ||
        !isValidString(input.email)
      )
        return frontServiceErrorResponse(message.INVALID_PARAMETERS);

      // Get user by username
      var userName = await user.findOne({
        where: { userName: input.userName.trim() }
      });

      // Get user by email address
      var userEmail = await user.findOne({
        where: { email: input.email.trim() }
      });

      if (userName != null && userEmail != null)
        return frontServiceErrorResponse(message.EMAIL_USER_NAME_ALREADY_EXIST);

      if (userName != null)
        return frontServiceErrorResponse(message.USER_NAME_ALREADY_EXISTS);

      if (userEmail != null)
        return frontServiceErrorResponse(message.EMAIL_USER_ALREADY_EXIST);

      // Return response
      return true;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method is used to remove refresh token from refresh token array. It would be considered as logout.
   *          So that anyone with specific refresh token can not access the system.
   *          If the refresh token is stolen from the user, someone can use it to generate as many new tokens as they'd like.
   *          To avoid this, we implemented logout
   * @param {*} input
   * @returns
   */
  async logout(input, authToken) {
    try {
      // Validate input data
      if (
        input == null ||
        !isValidString(authToken) ||
        !isValidString(input.email)
      )
        return frontServiceErrorResponse(message.INVALID_PARAMETERS);

      // Get front user by email address
      const frontUserDetails = await user.findOne({
        where: { email: input.email }
      });
      if (!frontUserDetails)
        return frontServiceErrorResponse(message.USER_DOES_NOT_EXIST);

      // Change token status when user performs logout action
      await userAuthTokens.update(
        { status: "n" },
        { where: { email: input.email, token: authToken } }
      );

      // Remove token from refreshtokens array
      refreshTokens = refreshTokens.filter((token) => authToken !== token);
      // Return response
      return true;
    } catch (e) {
      // Return error
      return frontServiceErrorResponse(e);
    }
  }

  async userActivate(input) {
    try {
      // Get front user by email address
      const frontUserDetails = await user.findOne({
        where: { webId: input.webId }
      });
      if (!frontUserDetails)
        return frontServiceErrorResponse(message.USER_DOES_NOT_EXIST);

      var checkUserVerified = await user.findOne({
        where: { webId: input.webId, status: "n" }
      });
      if (checkUserVerified) {
        await user.update({ status: "y" }, { where: { webId: input.webId } });
      } else {
        return frontServiceErrorResponse(message.ACCOUNT_ALREADY_VERIFIED);
      }

      return true;
    } catch (error) {
      return frontServiceErrorResponse(error);
    }
  }

  /**
   * Summary: This method check for user if exist based on received email and sends reset password link on mail id.
   * @param {*} input
   */
  async forgotPassword(input) {
    try {
      // Validate input data
      if (input == null || !isValidString(input.email))
        return frontServiceErrorResponse(message.INVALID_PARAMETERS);
      // Get front user by email address
      const frontUserDetails = await user.findOne({
        where: { email: input.email }
      });
      if (!frontUserDetails)
        return frontServiceErrorResponse(message.USER_DOES_NOT_EXIST);

      // Set reset password token for user
      const plainTextToken = random(40);
      await user.update(
        { resetPasswordToken: plainTextToken },
        { where: { email: input.email } }
      );

      // Set data to send in an email
      var subject = message.EMAIL_SUBJECT_RESET_PASSWORD;

      let sendEmailData = {
        subject: subject,
        templateName: "reset-password.ejs",
        emailToUser: input.email.trim()
      };

      // Set data that needs to be replaced in email html
      let emailTemplateReplaceData = {};
      emailTemplateReplaceData["name"] =
        frontUserDetails.dataValues["userName"];
      emailTemplateReplaceData["resetPasswordUrl"] =
        process.env.SITE_REDIRECT_URL +
        "/auth/reset-password?webId=" +
        frontUserDetails.dataValues.webId +
        "&token=" +
        plainTextToken;

      // Send an email
      sendEmail.generateHtmlForEmail(sendEmailData, emailTemplateReplaceData);

      return true;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method is used to reset the specific user's password based on received details.
   * @param {*} input
   * @returns
   */
  async resetPassword(input) {
    try {
      // Validate input data
      if (
        input == null ||
        !isValidString(input.webId) ||
        !isValidString(input.password)
      )
        return frontServiceErrorResponse(message.INVALID_PARAMETERS);

      // Check if request is valid by comparing token into system
      const frontUserDetails = await user.findOne({
        where: { webId: input.webId }
      });
      if (!frontUserDetails)
        return frontServiceErrorResponse(message.NOT_FOUND);

      if (
        (frontUserDetails && frontUserDetails.resetPasswordToken == "") ||
        frontUserDetails.resetPasswordToken == null
      ) {
        return frontServiceErrorResponse(message.RESET_TOKEN_EXPIRED);
      }
      // Get password hash and update user password
      var passwordHash = hash(input.password);
      var output = await user.update(
        { resetPasswordToken: "", password: passwordHash },
        { where: { id: frontUserDetails.id } }
      );
      if (output == null)
        return frontServiceErrorResponse(message.SOMETHING_WENT_WRONG);

      // Generate an access token
      // If this token is stolen, then they will have access to the account forever and the actual user won't be able to revoke access.
      // To prevent that, we sets expiration time so the token expire after a specific period.
      var expireTime = "24h";
      var token = jwt.sign(
        { _id: frontUserDetails.id, email: frontUserDetails.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: expireTime }
      );

      var newToken = {
        email: frontUserDetails.dataValues.email,
        token: token
      };
      await userAuthTokens.create(newToken);

      // Generate an refresh token
      // We are managing refresh token, so that is user token get expired while he/she is working, we can renew the token to prevent data/work loss for user.
      // This is used to increase usability without damaging any data. The actual token will expire after specific time. After that refresh token will be used to renew it.
      var refreshToken = jwt.sign(
        {
          _id: frontUserDetails.dataValues.id,
          email: frontUserDetails.dataValues.email
        },
        process.env.JWT_REFRESH_SECRET_KEY
      );
      refreshTokens.push(refreshToken);

      const loginUserDetails = await user.findOne({
        where: { id: frontUserDetails.id }
      });

      // Return response
      return {
        token: token,
        refreshToken: refreshToken,
        user: loginUserDetails
      };
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }
}
