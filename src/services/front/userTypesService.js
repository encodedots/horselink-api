import model from "../../models";
import { frontServiceErrorResponse } from "../../utils/sendResponse";
const { userType } = model;

export class UserTypesService {

    /**
     * Summary: This method get all user types
     * @returns
     */
    async getUserTypesList() {
        try {
            var output = "";
            output = await userType.findAll({
                where: {
                    isActive: "y",
                    deletedAt: null
                }
            });

            // Return response
            return output;
        } catch (e) {
            return frontServiceErrorResponse(e);
        }
    }
}
