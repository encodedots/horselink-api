import messages from "../../utils/message";
import model from "../../models";
import { isValidInteger, isValidString } from "../../utils/validation";
import { adminServiceErrorResponse } from "../../utils/sendResponse";
const { user, horseProduct } = model;

export class HorseProductService {

    /**
     * Summary: This method get specific user horse product details based on id and return it
     * @param {*} input
     * @returns
     */
    async getHorseProducts(input) {
        try {
            // Validate input data
            if (!isValidInteger(input) || input < 1)
                return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

            var output = "";
            // Get horse product details based on user id
            output = await horseProduct.findOne({
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
            return adminServiceErrorResponse(e);
        }
    }

    /**
     * Summary: This method create/update horse product
     * @param {*} input - This paramter contains parameter related to horseProduct table
     * @param {*} id - This paramter contains userId
     */
    async addHorseProduct(input, id) {
        try {
            var output = "";

            // Get user by id
            var userData = await user.findOne({ where: { id: id } });
            if (userData == null)
                return adminServiceErrorResponse(messages.NOT_FOUND);

            var detailExists = await horseProduct.findOne({ where: { userId: id } });

            // New horse product data object
            let newHorseProduct = {
                userId: isValidInteger(id) ? id : 0,
                title: isValidString(input.title) ? input.title.trim() : "",
                titleLink: isValidString(input.titleLink) ? input.titleLink.trim() : ""
            };

            if (!detailExists) {
                output = await horseProduct.create(newHorseProduct);
            } else {
                output = await horseProduct.update(newHorseProduct, {
                    where: { id: detailExists.dataValues.id }
                });
            }

            // Return response
            return output;
        } catch (e) {
            return adminServiceErrorResponse(e);
        }
    }
}