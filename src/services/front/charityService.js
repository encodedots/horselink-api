import model from "../../models";
import message from "../../utils/message";
const { charity } = model;
import { frontServiceErrorResponse } from "../../utils/sendResponse";
import { isValidString } from "../../utils/validation";
import sendEmail from "../../utils/sendEmail";

export class CharityService {

  /**
   * Summary: This method sent mail to admin email and store details in charity table
   * @param {*} input
   * @returns
   */
  async sentCharityMail(input) {
    try {
      var output = "";

      let charityDetails = {
        userName: isValidString(input.userName) ? input.userName.trim() : "",
        email: isValidString(input.email) ? input.email.trim() : "",
        charityName: isValidString(input.charityName) ? input.charityName.trim() : "",
        charityWebsite: isValidString(input.charityWebsite) ? input.charityWebsite.trim() : ""
      };

      output = await charity.create(charityDetails);

      let sendEmailData = {
        subject: message.EMAIL_SUBJECT_CHARITY_REQUEST,
        templateName: "charity-account-request.ejs",
        emailToUser: process.env.ADMIN_EMAIL
      };

      // Set data that needs to be replaced in email html
      let emailTemplateReplaceData = {};
      emailTemplateReplaceData["userName"] = input.userName;
      emailTemplateReplaceData["email"] = input.email;
      emailTemplateReplaceData["charityName"] = input.charityName;
      emailTemplateReplaceData["charityWebsite"] = input.charityWebsite;
      sendEmail.generateHtmlForEmail(sendEmailData, emailTemplateReplaceData);

      // Return response
      return output;
    } catch (e) {
      return frontServiceErrorResponse(e);
    }
  }
}
