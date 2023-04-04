import model from '../../models';
import { uploadFile, deleteFileFromS3 } from '../../utils/files';
import { hash } from "../../utils/hashing";
import messages from '../../utils/message';
import sendEmail from '../../utils/sendEmail';
import { isValidInteger, isValidString } from "../../utils/validation";
import s3Routes from '../../utils/s3Routes';
import md5 from 'md5';
import { handleTryCatchError } from '../../utils/sendResponse';
import { parseQueryString } from '../../utils/parseRequest';

const { user, businesses, userSportType } = model;
const { QueryTypes, Sequelize } = require('sequelize');
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
                throw new Error(messages.INVALID_PARAMETERS);

            var output = "";

            // Get a specific user details based in id
            output = await user.findOne(
                {
                    where: { id: input }
                });
            if (output == null)
                throw new Error(messages.NOT_FOUND);

            // Return response
            return output;
        } catch (e) {
            throw new Error(handleTryCatchError(e));
        }
    }

    /**
     * Summary: This method gets all register users
     * @returns 
     */
    async getUserlist() {
        try {
            var output = "";
            output = await user.findAll({ attributes: ['id', 'firstName', 'lastName', 'userName'], where: { isDeleted: 'n', isActive: 'y' } });
            if (output == null)
                throw new Error(messages.NOT_FOUND);

            // Return response
            return output;
        } catch (e) {
            throw new Error(handleTryCatchError(e));
        }
    }

    /**
     * Summary: This method gets all users and returns a list of it.
     * @param {*} input 
     * @returns 
     */
    async getUsers(input) {
        try {
            var output = "";
            var query = `select u.id, u.firstName, u.lastName, u.userName, u.telephone, u.croppedFileUrl, u.originalFileUrl, u.isActive from users as u where 1 `;

            // Filter data
            if (input && input.filterData) {
                // Filter based on search text
                if (isValidString(input.filterData["filter"])) {
                    var decodedData = parseQueryString(input.filterData.filter);
                    if (Object.keys(decodedData).length > 0) {
                        query += `and `;
                        Object.keys(decodedData).forEach((element, index) => {
                            if (index >= 0) {
                                var paramName = "";
                                paramName = element.substring(element.indexOf('[') + 1, element.indexOf(']'));
                                query += ` u.${paramName} like '%${decodedData[element]}%' `

                                if (element != '' && index < Object.keys(decodedData).length - 1)
                                    query += "and ";
                            }
                        });
                    }
                }

                // Order the data
                if (isValidString(input.filterData["sorts"])) {
                    var decodedData = parseQueryString(input.filterData.sorts);
                    if (Object.keys(decodedData).length > 0) {
                        query += `order by `;
                        Object.keys(decodedData).forEach((element, index) => {

                            var paramName = "";
                            paramName = element.substring(element.indexOf('[') + 1, element.indexOf(']'));
                            query += decodedData[element] == 1 ? `u.` + paramName + ` asc ` : (decodedData[element] == -1) ? `u.` + paramName + ` desc ` : ' ';

                            if (element != '' && index < Object.keys(decodedData).length - 1)
                                query += ", ";
                        });
                    }
                }

                // Limit data
                if (input.filterData["pageSize"])
                    query += `limit ${(input.filterData.pageIndex ? input.filterData.pageIndex : 1) * input.filterData.pageSize - input.filterData.pageSize}, ${input.filterData.pageSize}`;
            }

            output = await model.sequelize.query(
                query,
                {
                    type: QueryTypes.SELECT
                }
            );

            // Get total count for pagination
            let totalCount = await model.sequelize.query(`select COUNT(*) as count from users`,
                {
                    type: QueryTypes.SELECT
                });

            // Return response
            return {
                records: output,
                totalCount: totalCount[0].count,
                pageSize: input.filterData.pageSize,
                currentPage: input.filterData.pageIndex
            };
        } catch (e) {
            throw new Error(handleTryCatchError(e));
        }
    }

    /**
     * Summary: This method creates a new users and uploads the images to S3 bucket and creates entry of it.
     * @param {*} input - This paramter contains parameter related to users table
     * @param {*} inputFiles - This paramter contains file that needs to be uploaded
     */
    async createUser(input, inputFiles) {
        try {
            var output = "";

            // Validate input data
            if (input == null || !isValidString(input.userName))
                throw new Error(messages.INVALID_PARAMETERS);

            // Get user by username
            var userName = await user.findOne({ where: { userName: input.userName.trim() } });
            if (userName != null)
                throw new Error(messages.USER_NAME_ALREADY_EXISTS);

            // Get user by email address
            var userEmail = await user.findOne({ where: { email: input.email.trim() } });
            if (userEmail != null)
                throw new Error(messages.USER_EMAIL_ALREADY_EXISTS);

            // New user data object
            let newUser = {
                webId: md5(Date.now()).toString(),
                firstName: isValidString(input.firstName) ? input.firstName.trim() : "",
                lastName: isValidString(input.lastName) ? input.lastName.trim() : "",
                userName: isValidString(input.userName) ? input.userName.trim() : "",
                email: isValidString(input.email) ? input.email.trim() : "",
                password: isValidString(input.password) ? hash(input.password.trim()) : "",
                description: isValidString(input.description) ? input.description : "",
                memberNumber: isValidString(input.memberNumber) ? input.memberNumber : "",
                street: isValidString(input.street) ? input.street.trim() : "",
                town: isValidString(input.town) ? input.town.trim() : "",
                zipCode: isValidString(input.zipCode) ? input.zipCode.trim() : "",
                state: isValidString(input.state) ? input.state.trim() : "",
                country: isValidInteger(input.country) ? input.country : 0,
                telephone: isValidString(input.telephone) ? input.telephone.trim() : "",
                mobileNumber: isValidString(input.mobileNumber) ? input.mobileNumber.trim() : "",
                isNewsLetter: input.isNewsLetter,
                allowMessage: input.allowMessage,
                instagram: isValidString(input.instagram) ? input.instagram.trim() : "",
                facebook: isValidString(input.facebook) ? input.facebook.trim() : "",
                youtube: isValidString(input.youtube) ? input.youtube.trim() : "",
                tiktok: isValidString(input.tiktok) ? input.tiktok.trim() : "",
                website: isValidString(input.website) ? input.website.trim() : "",
            }

            if (inputFiles != undefined && inputFiles && Object.keys(inputFiles).length !== 0 && inputFiles.profileImage) {

                // Original file details
                if (inputFiles.profileImage["originalFile"]) {
                    var originalFileInput = {
                        file: inputFiles.profileImage["originalFile"],
                        filePath: s3Routes.USER_PROFILE_ORIGINAL_IMAGE + id + "/"
                    }

                    var originalFile = await uploadFile(originalFileInput);
                    newUser.originalFileName = originalFile.key;
                    newUser.originalFileUrl = originalFile.Location;
                }

                // Cropped file details
                if (inputFiles.profileImage["croppedFile"]) {
                    var croppedFileInput = {
                        file: inputFiles.profileImage["croppedFile"],
                        filePath: s3Routes.USER_PROFILE_CROPPED_IMAGE + id + "/"
                    }

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
            if (output == null)
                throw new Error(messages.SOMETHING_WENT_WRONG);

            // Set object to add specific user business details
            var createUserBusinessDetails = {
                encodedId: md5(Date.now()).toString(),
                userId: output.id,
                name: isValidString(input.businessCompanyName) ? input.businessCompanyName.trim() : "",
                street: isValidString(input.businessStreet) ? input.businessStreet.trim() : "",
                town: isValidString(input.businessTown) ? input.businessTown.trim() : "",
                zipCode: isValidString(input.businessZipCode) ? input.businessZipCode.trim() : "",
                state: isValidString(input.businessState) ? input.businessState.trim() : "",
                country: isValidInteger(input.businessCountry) ? input.businessCountry : 0,
                telephone: isValidString(input.businessTelephone) ? input.businessTelephone.trim() : "",
                mobileNumber: isValidString(input.businessMobileNumber) ? input.businessMobileNumber.trim() : "",
            }

            // Create new user business
            await businesses.create(createUserBusinessDetails)

            // Create user sport types
            if (input.preferences) {
                // Create object to add user selected sport type
                var selectedPreferences = input.preferences
                selectedPreferences.forEach(async selectedPreference => {
                    var newUserSportType = {
                        userId: output.id,
                        sortTypeId: selectedPreference
                    }
                    await userSportType.create(newUserSportType);
                });
            }

            // Send Email to user
            let sendEmailData = {
                subject: messages.EMAIL_SUBJECT_USER_ACCOUNT_CREATED_BY_ADMIN,
                templateName: 'user-account-create-from-admin-template.ejs',
                emailToUser: input.email.trim()
            }
            let emailTemplateReplaceData = output
            emailTemplateReplaceData['accountPassword'] = input.password.trim()
            sendEmail.generateHtmlForEmail(sendEmailData, emailTemplateReplaceData);

            // Return response
            return output;
        } catch (e) {
            throw new Error(handleTryCatchError(e));
        }
    }


    /**
     * Summary: This method updates information for specific user based on input parameter.
     * @param {*} id - This parameter contains the user id
     * @param {*} input - This paramter contains parameter related to user table
     * @param {*} inputFiles - This paramter contains file that needs to be uploaded
     */
    async updateUser(id, input, inputFiles) {
        try {
            var output = "";

            // Validate input data
            if (id < 1)
                throw new Error(messages.INVALID_PARAMETERS);

            var userData = await user.findOne({ where: { id: id } });
            if (userData == null)
                throw new Error(messages.NOT_FOUND);

            // Set specific user information to save
            var updateUser = {
                firstName: isValidString(input.firstName) ? input.firstName.trim() : "",
                lastName: isValidString(input.lastName) ? input.lastName.trim() : "",
                userName: isValidString(input.userName) ? input.userName.trim() : "",
                email: isValidString(input.email) ? input.email.trim() : "",
                description: isValidString(input.description) ? input.description : "",
                memberNumber: isValidString(input.memberNumber) ? input.memberNumber : "",
                street: isValidString(input.street) ? input.street.trim() : "",
                town: isValidString(input.town) ? input.town.trim() : "",
                zipCode: isValidString(input.zipCode) ? input.zipCode.trim() : "",
                state: isValidString(input.state) ? input.state.trim() : "",
                country: isValidInteger(input.country) ? input.country : 0,
                telephone: isValidString(input.telephone) ? input.telephone.trim() : "",
                mobileNumber: isValidString(input.mobileNumber) ? input.mobileNumber.trim() : "",
                isNewsLetter: input.isNewsLetter,
                allowMessage: input.allowMessage,
                instagram: isValidString(input.instagram) ? input.instagram.trim() : "",
                facebook: isValidString(input.facebook) ? input.facebook.trim() : "",
                youtube: isValidString(input.youtube) ? input.youtube.trim() : "",
                tiktok: isValidString(input.tiktok) ? input.tiktok.trim() : "",
                website: isValidString(input.website) ? input.website.trim() : "",
                isActive: input.isActive,
            };

            if (inputFiles != undefined && inputFiles && Object.keys(inputFiles).length !== 0 && inputFiles.profileImage) {

                // Original file details
                if (inputFiles.profileImage["originalFile"]) {
                    var originalFileInput = {
                        file: inputFiles.profileImage["originalFile"],
                        filePath: s3Routes.USER_PROFILE_ORIGINAL_IMAGE + id + "/"
                    }

                    var originalFile = await uploadFile(originalFileInput);
                    updateUser.originalFileName = originalFile.key;
                    updateUser.originalFileUrl = originalFile.Location;
                }

                // Cropped file details
                if (inputFiles.profileImage["croppedFile"]) {
                    var croppedFileInput = {
                        file: inputFiles.profileImage["croppedFile"],
                        filePath: s3Routes.USER_PROFILE_CROPPED_IMAGE + id + "/"
                    }

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
                throw new Error(messages.SOMETHING_WENT_WRONG);

            // Set object to add/update specific user business details
            var updateUserBusinessDetails = {
                name: isValidString(input.businessCompanyName) ? input.businessCompanyName.trim() : "",
                street: isValidString(input.businessStreet) ? input.businessStreet.trim() : "",
                town: isValidString(input.businessTown) ? input.businessTown.trim() : "",
                zipCode: isValidString(input.businessZipCode) ? input.businessZipCode.trim() : "",
                state: isValidString(input.businessState) ? input.businessState.trim() : "",
                country: isValidInteger(input.businessCountry) ? input.businessCountry : 0,
                telephone: isValidString(input.businessTelephone) ? input.businessTelephone.trim() : "",
                mobileNumber: isValidString(input.businessMobileNumber) ? input.businessMobileNumber.trim() : "",
            }

            // Check if the user business details are exist then update otherwise add
            const businessDetails = await businesses.findOne({ where: { userId: id } });
            if (!businessDetails) {
                // Create object to add new user business
                updateUserBusinessDetails.encodedId = md5(Date.now()).toString()
                updateUserBusinessDetails.userId = id
                await businesses.create(updateUserBusinessDetails)
            } else {
                // Update the code if the user business is exist
                await businesses.update(updateUserBusinessDetails, { where: { userId: id } })
            }

            // If sport type is exist then update
            if (input.preferences) {
                // Delete all the existing data of the user
                userSportType.destroy({ where: { userId: id } });

                // Create object to add user selected sport type
                var selectedPreferences = input.preferences
                selectedPreferences.forEach(async selectedPreference => {
                    var newUserSportType = {
                        userId: id,
                        sortTypeId: selectedPreference
                    }
                    await userSportType.create(newUserSportType);
                });
            }

            return output;
        } catch (e) {
            throw new Error(handleTryCatchError(e));
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
                throw new Error(messages.INVALID_PARAMETERS);

            // Get specific user data to delete related file
            var userData = await user.findOne({ where: { id: input } });
            if (userData == null)
                throw new Error(messages.NOT_FOUND);

            // Delete business
            await businesses.update({ isDeleted: 'y' }, { where: { userId: input } });
            await businesses.destroy({ where: { userId: input } });

            // Delete user sport type
            await userSportType.destroy({ where: { userId: input } });

            // Delete image from s3 bucket
            if (userData.dataValues.originalFileName != '' && userData.dataValues.originalFileName != null) {
                // Delete original file from s3
                var deleteImageParams = {
                    key: userData.dataValues.originalFileName
                }
                await deleteFileFromS3(deleteImageParams);
            }

            if (userData.dataValues.croppedFileName != '' && userData.dataValues.croppedFileName != null) {
                // Delete cropped file from s3
                var deleteCroppedImageParams = {
                    key: userData.dataValues.croppedFileName
                }
                await deleteFileFromS3(deleteCroppedImageParams);
            }

            // Delete specific user data based on id received in parameter
            await user.update({ isDeleted: 'y' }, { where: { id: input } });
            var output = await user.destroy({ where: { id: input } });

            // Return response data
            return output;
        } catch (e) {
            throw new Error(handleTryCatchError(e));
        }
    }
}