import messages from "../../utils/message";
import model from "../../models";
import { isValidInteger, isValidString } from "../../utils/validation";
import { adminServiceErrorResponse } from "../../utils/sendResponse";
import constants from "../../utils/constants";
const { QueryTypes, Sequelize } = require("sequelize");
const { faqManagement } = model;

export class FaqService {

  /**
   * Summary: This method gets all faq and returns a list of it.
   * @param {*} input This parameter contains input based on to faq filter
   * @returns
   */
  async getFaqList(input) {
    try {
      var output = "";
      var query = `select u.id, u.title, u.description, u.status, u.createdAt, u.updatedAt from ${constants.FAQ_MANAGEMENT} as u where u.deletedAt IS NULL `;

      var countQuery = query

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
          query += ` limit ${(input.page ? input.page : 1) * input.limit - input.limit
            }, ${input.limit}`;
        }
      }

      output = await model.sequelize.query(query, {
        type: QueryTypes.SELECT
      });

      // Get total count for pagination
      let totalCount = await model.sequelize.query(
        countQuery,
        {
          type: QueryTypes.SELECT
        }
      );

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
   * Summary: This method gets specific faq details based on id and return it
   * @param {*} input
   * @returns
   */
  async getFaqDetails(input) {
    try {
      // Validate input data
      if (!isValidInteger(input) || input < 1)
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      var output = "";

      // Get a specific user details based in id
      output = await faqManagement.findOne({
        where: { id: input }
      });

      if (output == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method creates a new faq and creates entry of it
   * @param {*} input - This paramter contains parameter related to faq table
   */
  async addFaqDetails(input) {
    try {
      var output = "";

      // Create object for faq
      let newFaqDetails = {
        title: isValidString(input.title) ? input.title.trim() : "",
        description: isValidString(input.description) ? input.description.trim() : ""
      };

      output = await faqManagement.create(newFaqDetails);

      // Return response
      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method updates information for specific faq based on input parameter.
   * @param {*} id - This parameter contains the faq id
   * @param {*} input - This paramter contains faq details
   */
  async updateFaqDetails(id, input) {
    try {
      var output = "";

      // Validate input data
      if (id < 1)
        return adminServiceErrorResponse(messages.INVALID_PARAMETERS);

      var faqData = await faqManagement.findOne({ where: { id: id } });
      if (faqData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      // Set specific faq information to update
      let updateFaqDetails = {
        title: isValidString(input.title) ? input.title.trim() : "",
        description: isValidString(input.description) ? input.description.trim() : ""
      };

      output = await faqManagement.update(updateFaqDetails, {
        where: { id: id }
      });

      if (output == null)
        return adminServiceErrorResponse(messages.SOMETHING_WENT_WRONG);

      return output;
    } catch (e) {
      return adminServiceErrorResponse(e);
    }
  }

  /**
   * Summary: This method updates the faq status based on input parameter
   * @param {*} id - This parameter contains the faq id
   * @param {*} input - This parameter contains faq status
   */
  async updateFaqStatus(id, status) {
    try {
      var output = "";

      var faqData = await faqManagement.findOne({ where: { id: id } });
      if (faqData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      var updateStatus = status = (status == false) ? "n" : "y";

      output = await faqManagement.update(
        { status: updateStatus },
        { where: { id: id } }
      );

      return output;
    } catch (error) {
      return adminServiceErrorResponse(error);
    }
  }

  /**
   * Summary: This method delete the faq details based on id
   * @param {*} id - This parameter contains the faq id
   */
  async deleteFaqDetails(id) {
    try {
      var output = "";

      var faqData = await faqManagement.findOne({ where: { id: id } });
      if (faqData == null)
        return adminServiceErrorResponse(messages.NOT_FOUND);

      output = await faqManagement.destroy({ where: { id: id } });

      return output;
    } catch (error) {
      return adminServiceErrorResponse(error);
    }
  }
}
