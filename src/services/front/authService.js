import model from "../../models";
import { hash, hash_compare } from "../../utils/hashing";
import message from "../../utils/message";
const { user, userAuthTokens } = model;
import { frontServiceErrorResponse } from "../../utils/sendResponse";
import { isValidString } from "../../utils/validation";
import md5 from "md5";
const jwt = require("jsonwebtoken");
var slugify = require("../../utils/slugifyUrl");
var refreshTokens = [];

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
        return frontServiceErrorResponse(message.INCORRECT_LOGIN_CREDENTIALS);

      // Compare user password
      const checkPassword = hash_compare(
        hash(input.password),
        frontUserDetails.password
      );
      if (!checkPassword)
        return frontServiceErrorResponse(message.INCORRECT_LOGIN_CREDENTIALS);

      // Check if user is active
      if (frontUserDetails.isActive !== "y")
        return frontServiceErrorResponse(message.ACCOUNT_SUSPENDED);

      // Check if user details are deleted, As we do soft delete it will have y/n flag here
      if (frontUserDetails.isDeleted !== "n")
        return frontServiceErrorResponse(message.ACCOUNT_DELETED);

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
          : ""
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

      var newToken = {
        email: output.dataValues.email,
        token: token
      };

      await userAuthTokens.create(newToken);

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
}
