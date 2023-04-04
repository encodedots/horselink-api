import messages from "./message";

/**
 * This function will send success response to API call
 * @param res
 * @param code
 * @param errorMessage
 * @param e
 * @returns {*}
 */
export const sendErrorResponse = (res, code, errorMessage, e = null) => res.status(code).send({
    status: 'error',
    error: errorMessage,
    e: e?.toString().replace("SequelizeDatabaseError:", "").replace("SequelizeValidationError:", ""),
});

/**
 * This function will send error response to API call
 * @param res
 * @param code
 * @param data
 * @param message
 * @returns {*}
 */
export const sendSuccessResponse = (res, code, data, message = 'Successful') => res.status(code).send({
    status: 'success',
    data,
    message,
});

/**
 * Summary: This function will return form of service error response. This is used to return response from service to controller so that response from service can easily managed.
 * @param errorMessage
 * @param data
 * @returns {*}
 */
export const frontServiceErrorResponse = (errorMessage, data = null) => ({
    status: false,
    error: handleTryCatchError(errorMessage),
    data: data
});

/**
 * Summary: This function will send success response to API call.
 * @param res
 * @param code
 * @param data
 * @param message
 * @returns {*}
 */
export const frontSendSuccessResponse = (res, code, data, message = 'Successful') => res.status(code).send({
    status: true,
    code,
    data,
    message,
});

/**
 * Summary: This function will send error response to API call from front.
 * @param res
 * @param code
 * @param errorMessage
 * @param data
 * @returns {*}
 */
export const frontSendErrorResponse = (res, code, errorMessage, data = null) => res.status(code).send({
    status: false,
    code: code,
    message: handleTryCatchError(errorMessage),
    data: data
});


export function handleTryCatchError(error) {
    if (error.name == "SequelizeValidationError" || error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeForeignKeyConstraintError') {
        return error.errors.map(e => e.messages);
    } else if (error.name != null && error.name != 'undefined') {
        return messages.COULD_NOT_PERFORM_ACTION;
    } else {
        return error;
    }
};