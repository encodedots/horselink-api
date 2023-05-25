const client = require("@mailchimp/mailchimp_marketing");
client.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER
});

/**
 * Summary: This function will add user and Batch subscribe or unsubscribe status
 * @param errorMessage
 * @param data
 * @returns {*}
 */
exports.subscribedUnsubscribedmailchimpData = async function (
  postData,
  updateExisting
) {
  const run = async () => {
    try {
      const response = await client.lists.batchListMembers(
        process.env.MAILCHIMP_LIST,
        {
          members: [postData],
          update_existing: updateExisting
        }
      );

      console.log("response", response);
      if (response.error_count <= 0) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      if (e && e.response && e.response.body && e.response.body.detail) {
        console.log(e.response.body.detail);
      }
      return false;
    }
  };
  var resData = await run();
  console.log("resData", resData);
  return resData;
};

/**
 * Summary: This function will update the user (Update list member) (Example: first name, last name and email)
 * @param {*} email
 * @param {*} updatedData
 * @returns
 */
exports.updateUserMailchimpData = async function (email, updatedData) {
  const run = async () => {
    try {
      const response = await client.lists.updateListMember(
        process.env.MAILCHIMP_LIST,
        email,
        updatedData
      );

      if (response && response.status) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      if (e && e.response && e.response.body && e.response.body.detail) {
        console.log(e.response.body.detail);
      }
      return false;
    }
  };
  var resData = await run();
  console.log("resData", resData);
  return resData;
};

/**
 * Summary: This function will get the user info (Get member info)
 * @param {*} email
 * @returns
 */
exports.getUserMailchimpData = async function (email) {
  const run = async () => {
    try {
      const response = await client.lists.getListMember(
        process.env.MAILCHIMP_LIST,
        email
      );

      if (response && response.status) {
        return response.status;
      }
    } catch (e) {}
  };
  var resData = await run();
  console.log("resData", resData);
  return resData;
};

/**
 * Summary: This function will delete the user (Archive list member)
 * @param {*} email
 * @returns
 */
exports.deleteUserMailchimpData = async function (email) {
  const run = async () => {
    try {
      const response = await client.lists.deleteListMember(
        process.env.MAILCHIMP_LIST,
        email
      );
      return true;
    } catch (e) {
      // console.log("e", e)
      // if (e && e.response && e.response.body && e.response.body.detail) {
      //     console.log(e.response.body.detail);
      // }
      return false;
    }
  };
  var resData = await run();
  console.log("resData11", resData);
  return resData;
};
