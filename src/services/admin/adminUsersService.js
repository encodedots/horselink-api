import { hash, hash_compare } from "../../utils/hashing";
import messages from '../../utils/message';
import model from '../../models';
import { isValidString } from "../../utils/validation";
import { handleTryCatchError } from "../../utils/sendResponse";

const { adminUser } = model;

export class AdminUserService {

    //#region GET APIs

    /**
     * Summary: This method is used to get specific admin user details based on id.
     * @param {*} input
     * @returns
     */
    async getAdminById(input) {
        try {
            // Validate input
            if (input < 1)
                throw new Error(messages.INVALID_PARAMETERS);

            // Find specific admin user based on id
            var output = "";
            output = await adminUser.findOne({ where: { id: input } });
            return output;
        } catch (e) {
            throw new Error(handleTryCatchError(e));
        }
    }

    //#endregion GET APIs

    //#region POST APIs

    /**
     * Summary: This method checks for valid login user and creates new token for valid user.
     * @param {*} input
     * @returns
     */
    async adminLogin(input) {
        try {
            // Validate input
            if (input == null || (input && (!isValidString(input.email) || !isValidString(input.password))))
                throw new Error(messages.INVALID_PARAMETERS);

            var output = {};

            // Get information for user if valid otherwise send error
            const adminUserDetails = await adminUser.findOne({ where: { email: input.email } });
            if (!adminUserDetails) 
                throw new Error(messages.INCORRECT_LOGIN_CREDENTIALS);
                
            const checkPassword = hash_compare(hash(input.password), adminUserDetails.password);
            if (!checkPassword)
                throw new Error(messages.INCORRECT_LOGIN_CREDENTIALS);

            if (adminUserDetails.isActive !== 'y')
                throw new Error(messages.ACCOUNT_SUSPENDED);

            if (adminUserDetails.isDeleted !== 'n')
                throw new Error(messages.ACCOUNT_DELETED);

            output.user = adminUserDetails;

            // Create new authentication token
            output.token = await adminUserDetails.newToken();
            if (output == null)
                throw new Error(messages.SOMETHING_WENT_WRONG);

            // Return output
            return output;
        } catch (e) {
            throw new Error(handleTryCatchError(e));
        }
    }

    //#endregion POST APIs
}