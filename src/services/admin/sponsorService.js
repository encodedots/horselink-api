import messages from "../../utils/message";
import model from "../../models";
import { isValidInteger, isValidString } from "../../utils/validation";
import { adminServiceErrorResponse } from "../../utils/sendResponse";
const { user, sponsors } = model;

export class SponsorService {

    /**
     * Summary: This method get sponsor details based on id and return it
     * @param {*} input
     * @returns
     */
    async getSponsor(input) {
        try {
            // Validate input data
            if (!isValidInteger(input) || input < 1)
                return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

            var output = "";
            // Get a sponsor details based on id
            output = await sponsors.findAll({
                where: { userId: input }
            });

            // Return response
            return output;
        } catch (e) {
            return adminServiceErrorResponse(e);
        }
    }

    /**
     * Summary: This method add/update sponsor details
     * @param {*} input - This paramter contains parameter related to sponsor table
     * @param {*} id - This paramter contains userId
     */
    async addSponser(input, id) {
        try {
            var output = "";

            // Get user by id
            var userData = await user.findOne({ where: { id: id } });
            if (userData == null)
                return adminServiceErrorResponse(messages.NOT_FOUND);

            await sponsors.destroy({ where: { userId: id } });

            var sponsersArr = []
            if (input.sponsors && input.sponsors.length > 0) {
                let sponsors = input.sponsors
                sponsors.forEach(element => {
                    // New object for sponsor details
                    if (element.name != '' && element.code != '') {
                        let newSponsor = {
                            userId: isValidInteger(id) ? id : 0,
                            title: isValidString(input.title) ? input.title.trim() : "",
                            name: isValidString(element.name) ? element.name.trim() : "",
                            code: isValidString(element.code) ? element.code.trim() : ""
                        };
                        sponsersArr.push(newSponsor)
                    }
                });
            }

            output = await sponsors.bulkCreate(sponsersArr)

            // Return response
            return output;
        } catch (e) {
            console.log("e1", e)
            return adminServiceErrorResponse(e);
        }
    }
}
