const client = require("@mailchimp/mailchimp_marketing");
client.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER
});

/**
 * Summary: This function will return form of service error response. This is used to return response from service to controller so that response from service can easily managed.
 * @param errorMessage
 * @param data
 * @returns {*}
 */
exports.subscribedUnsubscribedmailchimpData = async function (postData, updateExisting) {

    const run = async () => {
        try {
            const response = await client.lists.batchListMembers(process.env.MAILCHIMP_LIST, {
                members: [postData],
                update_existing: updateExisting
            });

            console.log("response", response)
            if (response.error_count <= 0) {
                return true
            } else {
                return false
            }
        } catch (e) {
            if (e && e.response && e.response.body && e.response.body.detail) {
                console.log(e.response.body.detail);
            }
            return false
        }
    };
    var resData = await run();
    console.log("resData", resData)
    return resData
};

exports.updateUserMailchimpData = async function (email, updatedData) {
    const run = async () => {
        try {
            const response = await client.lists.updateListMember(
                process.env.MAILCHIMP_LIST,
                email,
                updatedData
            );

            if (response && response.status) {
                return true
            } else {
                return false
            }
        } catch (e) {
            if (e && e.response && e.response.body && e.response.body.detail) {
                console.log(e.response.body.detail);
            }
            return false
        }
    };
    var resData = await run();
    console.log("resData", resData)
    return resData
};

exports.getUserMailchimpData = async function (email) {
    const run = async () => {
        try {
            const response = await client.lists.getListMember(
                process.env.MAILCHIMP_LIST,
                email
            );

            if (response && response.status) {
                return response.status
            }
        } catch (e) {
        }
    };
    // run()
    var resData = await run();
    console.log("resData", resData)
    return resData
};


