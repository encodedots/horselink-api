import nodemailer from "nodemailer";
import ejs from "ejs";
import constants from "./constants";
const dotenv = require("dotenv").config();

/**
 * This function will create authentication for SMTP for sending emails
 */
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT,
  // secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
  auth: {
    user: process.env.EMAIL_SMTP_USERNAME,
    pass: process.env.EMAIL_SMTP_PASSWORD
  }
});

/**
 * This function will send email to respective email address
 * @param to
 * @param from
 * @param subject
 * @param html
 * @returns {Promise<{always: function(): this, pipe: function(): *, promise: function(*=): (*), state: function(): {loc: null}|((name: string, styles: AnimationStyleMetadata, options?: {params: {[p: string]: any}}) => AnimationStateMetadata)|{parsedOptions: {}, positionals: [], ignored: [], warnings: [], options: *, leftovers: [], errors: []}|null, catch: function(*=): *, then: function(*=, *=, *=): *}|{always: function(): this, pipe: function(): *, promise: function(*=): (*), state: function(): {loc: null}|((name: string, styles: AnimationStyleMetadata, options?: {params: {[p: string]: any}}) => AnimationStateMetadata)|{parsedOptions: {}, positionals: [], ignored: [], warnings: [], options: *, leftovers: [], errors: []}|null, catch: function(*=): *, then: function(*=, *=, *=): *}|{always: function(): this, pipe: function(): *, promise: function(*=): (*), state: function(): {loc: null}|((name: string, styles: AnimationStyleMetadata, options?: {params: {[p: string]: any}}) => AnimationStateMetadata)|{parsedOptions: {}, positionals: [], ignored: [], warnings: [], options: *, leftovers: [], errors: []}|null, catch: function(*=): *, then: function(*=, *=, *=): *}>}
 */
exports.sendMailToCorrespondence = async function (to, from, subject, html) {
  return transporter.sendMail({
    from: process.env.SEND_FROM_EMAIL,
    to: to,
    subject: subject,
    html: html
  });
};

/**
 * THis function will always sent email with attachments
 * @param sendTo
 * @param Subject
 * @param emailBody
 * @param Attachment
 * @returns {{always: (function(): promise), pipe: (function(): jQuery), promise: (function(*=): *), state: (function(): string), catch: (function(*=): *), then: (function(*=, *=, *=): jQuery)}|{always: (function(): promise), pipe: (function(): jQuery), promise: (function(*=): *), state: (function(): string), catch: (function(*=): *), then: (function(*=, *=, *=): jQuery)}|{always: (function(): promise), pipe: (function(): jQuery), promise: (function(*=): *), state: (function(): string), catch: (function(*=): *), then: (function(*=, *=, *=): jQuery)}}
 */
exports.sendwithAttachmentImage = async function (
  sendTo,
  Subject,
  emailBody,
  Attachment
) {
  try {
    const sendMail = await transporter.sendMail({
      from: process.env.SEND_FROM_EMAIL,
      from: "HORSELINK<" + process.env.SEND_FROM_EMAIL + ">",
      to: sendTo,
      subject: Subject,
      html: emailBody,
      attachments: Attachment
    });
    return sendMail;
  } catch (e) {
    // Send error message on fail
  }
};

/**
 * This functin will generate email template with dynamic data and will used as HTML form email
 * @param sendEmailTemplateData
 * @param replaceEmailTemplateData
 * @returns {Promise<void>}
 */
exports.generateHtmlForEmail = async function (
  sendEmailTemplateData,
  replaceEmailTemplateData
) {
  let linkReplaceData = {
    siteUrl: process.env.SITE_REDIRECT_URL,
    contactAddress: "Horselink GmbH, <br>Gartenstr. 34, 82049 Pullach, Germany"
  };

  const emailHTML = await ejs.renderFile(
    process.env.EMAIL_TEMPLATE_LOCATION + sendEmailTemplateData.templateName,
    {
      replaceEmailTemplateData: replaceEmailTemplateData,
      linkReplaceData: linkReplaceData
    }
  );

  let attachments = [
    {
      filename: "header_logo.png",
      path:
        process.env.EMAIL_TEMPLATE_IMAGE_LOCATION + "images/header_logo.png",
      cid: "header_logo" //same cid value as in the html img src
    }
  ];

  //   if (process.env.NODE_ENV != "local") {
  this.sendwithAttachmentImage(
    sendEmailTemplateData.emailToUser,
    sendEmailTemplateData.subject,
    emailHTML,
    attachments
  );
  //   }
};
