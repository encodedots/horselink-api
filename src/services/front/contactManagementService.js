import model from "../../models";
import message from "../../utils/message";
import constants from "../../utils/constants";
import { frontServiceErrorResponse } from "../../utils/sendResponse";
import { isValidString } from "../../utils/validation";
import sendEmail from "../../utils/sendEmail";
const { contactManagement } = model;

export class ContactManagementService {

  /**
   * Summary: This method sent mail to admin email and store details in contact management table
   * @param {*} input
   * @returns
   */
  async sentContactsMail(input) {
    try {
      var output = "";
      var sub = "";
      var title = "";

      let charityDetails = {
        firstName: isValidString(input.firstName) ? input.firstName.trim() : "",
        lastName: isValidString(input.lastName) ? input.lastName.trim() : "",
        email: isValidString(input.email) ? input.email.trim() : "",
        message: isValidString(input.message) ? input.message.trim() : "",
        type: isValidString(input.type) ? input.type.trim() : ""
      };

      output = await contactManagement.create(charityDetails);

      if (input.type == constants.CONTACT_TYPE) {
        sub = message.CONTACT_REQUEST;
        title = "Thank you for connect with us";
      } else if (input.type == constants.REPORT_TYPE) {
        sub = message.REPORT_REQUEST;
        title = "There is request for reports with below details";
      } else {
        sub = message.HELP_REQUEST;
        title = "There is request for help with below details";
      }

      let sendEmailData = {
        subject: sub,
        templateName: "contact-management.ejs",
        emailToUser: process.env.ADMIN_EMAIL
      };

      // Set data that needs to be replaced in email html
      let emailTemplateReplaceData = {};
      emailTemplateReplaceData["firstName"] = input.firstName;
      emailTemplateReplaceData["lastName"] = input.lastName;
      emailTemplateReplaceData["email"] = input.email;
      emailTemplateReplaceData["message"] = input.message;
      emailTemplateReplaceData["title"] = title;
      sendEmail.generateHtmlForEmail(sendEmailData, emailTemplateReplaceData);

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }
}
