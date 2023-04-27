import model from "../../models";
import { uploadFile, deleteFileFromS3 } from "../../utils/files";
import { hash } from "../../utils/hashing";
import messages from "../../utils/message";
import { isValidInteger, isValidString } from "../../utils/validation";
import md5 from "md5";
import { adminServiceErrorResponse } from "../../utils/sendResponse";
import s3Routes from "../../utils/s3Routes";
import constants from "../../utils/constants";
var slugify = require("../../utils/slugifyUrl");
const { user } = model;
const { QueryTypes, Sequelize } = require("sequelize");
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
      if (!isValidInteger(input) || input < 1)
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";

      // Get a specific user details based in id
      output = await user.findOne({
        where: { id: input }
      });

      if (output == null) return adminServiceErrorResponse(messages.NOT_FOUND);

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method gets all register users
   * @returns
   */
  async getUserList() {
    try {
      var output = "";
      output = await user.findAll({
        attributes: ["id", "firstName", "lastName", "userName"],
        where: { isDeleted: "n", isActive: "y" }
      });

      if (output == null) return adminServiceErrorResponse(messages.NOT_FOUND);

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method gets all users and returns a list of it.
   * @param {*} input This parameter contains parameter related to user table
   * @returns
   */
  async getUsers(input) {
    try {
      var output = "";
      var query = `select u.id, u.firstName, u.lastName, u.userName, u.email, u.mobileNumber, u.telephone, u.croppedFileUrl, u.originalFileUrl, u.isActive, u.createdAt, u.updatedAt, u.isDeleted from ${constants.USERS} as u where 1 `;

      var countQuery = query;

      // Filter data
      if (input !== undefined) {
        // Filter based on search text
        if (input.filter !== undefined) {
          let filterdata = input.filter;
          query += ` and `;
          Object.keys(filterdata).forEach(function (key, index) {
            var val = filterdata[key];
            const keyName = key;
            var paramName = "";
            paramName = keyName;
            query += `u.${paramName} like '%${val}%'`;

            if (keyName != "" && index < Object.keys(filterdata).length - 1) {
              query += "and ";
            }
          });
        }

        // Order the data
        if (input.sort !== undefined) {
          let sortdata = input.sort;
          query += ` order by `;
          Object.keys(sortdata).forEach(function (key, i) {
            var val = sortdata[key];
            const keyName = key;
            var paramName = "";
            paramName = keyName;

            query += `u.${paramName} ${val}`;

            if (keyName != "" && i < Object.keys(sortdata).length - 1) {
              query += ", ";
            }
          });
        }

        // Limit Data
        if (input.limit !== undefined && input.page !== undefined) {
          query += ` limit ${
            (input.page ? input.page : 1) * input.limit - input.limit
          }, ${input.limit}`;
        }
      }

      output = await model.sequelize.query(query, {
        type: QueryTypes.SELECT
      });

      // Get total count for pagination
      let totalCount = await model.sequelize.query(countQuery, {
        type: QueryTypes.SELECT
      });

      // Return response
      return {
        records: output,
        totalCount: totalCount.length,
        pageSize: input.limit,
        currentPage: input.page
      };
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method creates a new users and creates entry of it.
   * @param {*} input - This paramter contains parameter related to users table
   */
  async createUser(input, inputFiles) {
    try {
      var output = "";

      // Validate input data
      if (input == null || !isValidString(input.userName))
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      // Get user by username
      var userName = await user.findOne({
        where: { userName: input.userName.trim() }
      });
      if (userName != null)
        return adminServiceErrorResponse(messages.USER_NAME_ALREADY_EXISTS);

      // Get user by email address
      var userEmail = await user.findOne({
        where: { email: input.email.trim() }
      });
      if (userEmail != null)
        return adminServiceErrorResponse(messages.EMAIL_USER_ALREADY_EXIST);

      var userSlug = await slugify.slugifyUsername(input.userName);

      // New user data object
      let newUser = {
        webId: md5(Date.now()).toString(),
        firstName: isValidString(input.firstName) ? input.firstName.trim() : "",
        lastName: isValidString(input.lastName) ? input.lastName.trim() : "",
        userName: isValidString(input.userName) ? input.userName.trim() : "",
        email: isValidString(input.email) ? input.email.trim() : "",
        password: isValidString(input.password)
          ? hash(input.password.trim())
          : "",
        description: isValidString(input.description)
          ? input.description.trim()
          : "",
        userNameSlug: userSlug ? userSlug.trim() : "",
        planName: isValidString(input.planName) ? input.planName.trim() : "",
        userTypeId: isValidInteger(input.userTypeId) ? input.userTypeId : 0,
        colorTemplate: isValidString(input.colorTemplate)
          ? input.colorTemplate.trim()
          : ""
      };

      if (
        inputFiles != undefined &&
        inputFiles &&
        Object.keys(inputFiles).length !== 0 &&
        inputFiles.profileImage
      ) {
        // Original file details
        if (inputFiles.profileImage["originalFile"]) {
          var originalFileInput = {
            file: inputFiles.profileImage["originalFile"],
            filePath: s3Routes.USER_PROFILE_ORIGINAL_IMAGE + id + "/"
          };

          var originalFile = await uploadFile(originalFileInput);
          newUser.originalFileName = originalFile.key;
          newUser.originalFileUrl = originalFile.Location;
        }

        // Cropped file details
        if (inputFiles.profileImage["croppedFile"]) {
          var croppedFileInput = {
            file: inputFiles.profileImage["croppedFile"],
            filePath: s3Routes.USER_PROFILE_CROPPED_IMAGE + id + "/"
          };

          var croppedFile = await uploadFile(croppedFileInput);
          newUser.croppedFileName = croppedFile.key;
          newUser.croppedFileUrl = croppedFile.Location;
        } else {
          if (inputFiles.profileImage["originalFile"]) {
            newUser.croppedFileName = "";
            newUser.croppedFileUrl = "";
          }
        }
      }

      output = await user.create(newUser);

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method update the user
   * @param {*} id - This paramter contains user id
   * @param {*} input - This paramter contains parameter related to users table
   */
  async addContact(input, id) {
    try {
      var output = "";

      // Validate input data
      if (input == null || id < 1)
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      // Get user by id
      var userDetails = await user.findOne({ where: { id: id } });
      if (userDetails == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      // Update user data object
      let newUser = {
        telephone: isValidInteger(input.telephone) ? input.telephone : 0,
        mobileNumber: isValidString(input.mobileNumber)
          ? input.mobileNumber.trim()
          : "",
        street: isValidString(input.street) ? input.street.trim() : "",
        town: isValidString(input.town) ? input.town.trim() : "",
        zipCode: isValidInteger(input.zipCode) ? input.zipCode : 0,
        state: isValidString(input.state) ? input.state.trim() : "",
        country: isValidInteger(input.country) ? input.country : 0,
        website: isValidString(input.website) ? input.website.trim() : ""
      };

      output = await user.update(newUser, { where: { id: id } });

      if (output == null)
        return adminServiceErrorResponse(messages.SOMETHING_WENT_WRONG);

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method updates information for specific user based on input parameter
   * @param {*} id - This parameter contains the user id
   * @param {*} input - This paramter contains parameter related to user table
   */
  async updateUser(id, input, inputFiles) {
    try {
      var output = "";

      // Validate input data
      if (id < 1) return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      // Get user by id
      var userData = await user.findOne({ where: { id: id } });
      if (userData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      var userSlug = await slugify.slugifyUsername(input.userName);

      // Set specific user information to save
      var updateUser = {
        firstName: isValidString(input.firstName) ? input.firstName.trim() : "",
        lastName: isValidString(input.lastName) ? input.lastName.trim() : "",
        userName: isValidString(input.userName) ? input.userName.trim() : "",
        email: isValidString(input.email) ? input.email.trim() : "",
        description: isValidString(input.description)
          ? input.description.trim()
          : "",
        userNameSlug: userSlug ? userSlug.trim() : "",
        planName: isValidString(input.planName) ? input.planName.trim() : "",
        userTypeId: isValidInteger(input.userTypeId) ? input.userTypeId : 0,
        colorTemplate: isValidString(input.colorTemplate)
          ? input.colorTemplate.trim()
          : ""
      };

      if (
        inputFiles != undefined &&
        inputFiles &&
        Object.keys(inputFiles).length !== 0 &&
        inputFiles.profileImage
      ) {
        // Original file details
        if (inputFiles.profileImage["originalFile"]) {
          var originalFileInput = {
            file: inputFiles.profileImage["originalFile"],
            filePath: s3Routes.USER_PROFILE_ORIGINAL_IMAGE + id + "/"
          };

          var originalFile = await uploadFile(originalFileInput);
          updateUser.originalFileName = originalFile.key;
          updateUser.originalFileUrl = originalFile.Location;
        }

        // Cropped file details
        if (inputFiles.profileImage["croppedFile"]) {
          var croppedFileInput = {
            file: inputFiles.profileImage["croppedFile"],
            filePath: s3Routes.USER_PROFILE_CROPPED_IMAGE + id + "/"
          };

          var croppedFile = await uploadFile(croppedFileInput);
          updateUser.croppedFileName = croppedFile.key;
          updateUser.croppedFileUrl = croppedFile.Location;
        } else {
          if (inputFiles.profileImage["originalFile"]) {
            updateUser.croppedFileName = "";
            updateUser.croppedFileUrl = "";
          }
        }
      }

      output = await user.update(updateUser, { where: { id: id } });
      if (output == null)
        return adminServiceErrorResponse(messages.SOMETHING_WENT_WRONG);

      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method deletes user data from database and deletes the reference file from S3 bucket.
   * @param {*} input
   * @returns
   */
  async deleteUser(input) {
    try {
      var output = "";

      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      // Get specific user data
      var userData = await user.findOne({ where: { id: input } });
      if (userData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      // Delete image from s3 bucket
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

      // Delete specific user data based on id received in parameter
      await user.update({ isDeleted: "y" }, { where: { id: input } });
      var output = await user.destroy({ where: { id: input } });

      // Return response data
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method updates the user status based on id
   * @param {*} id - This parameter contains the user id
   * @param {*} input - This parameter contains user status
   */
  async updateUserStatus(id, input) {
    try {
      var userData = await user.findOne({ where: { id: id } });
      if (userData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      var updatedStatus = input == false ? "n" : "y";
      await user.update({ isActive: updatedStatus }, { where: { id: id } });

      return true;
    } catch (error) {
      return adminServiceErrorResponse(error);
    }
  }
}
