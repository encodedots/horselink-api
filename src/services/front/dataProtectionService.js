import model from "../../models";
import message from "../../utils/message";
import { frontServiceErrorResponse } from "../../utils/sendResponse";
import { isValidString } from "../../utils/validation";
import sendEmail from "../../utils/sendEmail";
const { dataProtection } = model;

export class DataProtectionService {

  /**
   * Summary: This method sent mail to admin email and store details in database
   * @param {*} input
   * @returns
   */
  async sentDataProtectionMail(input) {
    try {
      var output = "";

      let data = {
        fullName: isValidString(input.fullName) ? input.fullName.trim() : "",
        email: isValidString(input.email) ? input.email.trim() : "",
        countryOfResidence: isValidString(input.countryOfResidence) ? input.countryOfResidence.trim() : "",
        horseLinkTo: isValidString(input.horseLinkTo) ? input.horseLinkTo.trim() : ""
      };

      output = await dataProtection.create(data);

      let sendEmailData = {
        subject: message.GDPR_REQUEST,
        templateName: "gdpr-account-request.ejs",
        emailToUser: process.env.ADMIN_EMAIL
      };

      // Set data that needs to be replaced in email html
      let emailTemplateReplaceData = {};
      emailTemplateReplaceData["fullName"] = input.fullName;
      emailTemplateReplaceData["email"] = input.email;
      emailTemplateReplaceData["countryOfResidence"] = input.countryOfResidence;
      emailTemplateReplaceData["horseLinkTo"] = input.horseLinkTo;
      sendEmail.generateHtmlForEmail(sendEmailData, emailTemplateReplaceData);

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }
}
