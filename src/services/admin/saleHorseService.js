import model from "../../models";
import { adminServiceErrorResponse } from "../../utils/sendResponse";
import { isValidInteger, isValidString } from "../../utils/validation";
const { user, saleHorse } = model;
export class SaleHorseService {
  /**
   * Summary: This method creates a new sale horse entry
   * @param {*} input - This paramter contains parameter related to sale horse table
   */
  async addHorseForSale(id, input) {
    try {
      var output = "";
      var horseArr = [];
      // Get user by id
      var userData = await user.findOne({ where: { id: id } });
      if (userData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      await saleHorse.destroy({ where: { userId: id } });

      if (input.descriptions && input.descriptions.length > 0) {
        input.descriptions.forEach((ele) => {
          let newUserInfo = {
            userId: isValidInteger(id) ? id : 0,
            title: isValidString(input.title) ? input.title.trim() : "",
            description: isValidString(ele.description)
              ? ele.description.trim()
              : "",
            fileName: isValidString(ele.fileName) ? ele.fileName.trim() : "",
            fileUrl: isValidString(ele.fileUrl) ? ele.fileUrl.trim() : "",
            link: isValidString(ele.link) ? ele.link.trim() : ""
          };
          horseArr.push(newUserInfo);
        });
      }

      output = await saleHorse.bulkCreate(horseArr);
      // Return response
      return output;
    } catch (e) {
      console.log("e", e);
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method gets specific sale horse details based on userid and return it
   * @param {*} input
   * @returns
   */
  async getSaleHorseDetails(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";
      // Get a specific user details based in id
      output = await saleHorse.findAll({
        where: { userId: input }
      });

      if (output == null) return adminServiceErrorResponse(messages.NOT_FOUND);

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }
}
