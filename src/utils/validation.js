/**
 * Summary: This file is used to manage validation function that checks if specific value is valid or not based on integer, string, etc. type
 */

/**
 * Summary: This function is used to check if input is valid integer or not.
 * @param {*} input
 * @returns
 */
exports.isValidInteger = function (input) {
    if (!isNumber(input) && !Number.isInteger(input) && (!Number.isInteger(parseInt(input)) || isNaN(parseInt(input))))
        return false;

    return true;
};

/**
 * Summary: This function is used to check if input is valid float or not.
 * @param {*} input
 * @returns
 */
exports.isValidFloat = function (input) {
    if ((typeof input != 'number' && typeof parseFloat(input) != 'number') || isNaN(input))
        return false;

    return true;
};

/**
 * Summary: This function is used to check if input is valid string or not.
 * @param {*} input
 * @returns
 */
exports.isValidString = function (input) {
    if (typeof input != "string" || input == "" || input == null || input == 'undefined' || typeof input == undefined)
        return false;

    return true;
};

/**
 * Summary: This function is used to check if input is valid date or not.
 * @param {*} input
 * @returns
 */
exports.isValidDate = function (input) {
    if (typeof input != "string" || input == "" || input == null || input == 'undefined' || typeof input == undefined)
        return false;

    return true;
};

/**
 * Summary: This function is used to check if input is valid object or not.
 * @param {*} input
 * @returns
 */
exports.isValidObject = function (input) {
    if (typeof input != 'object')
        return false;

    return true;
};

/**
 * Summary: This function is used to check if input object is empty or not.
 * @param {*} input
 * @returns
 */
exports.isEmptyObject = function (input) {
    if (typeof input == 'object' && Object.keys(input).length < 1)
        return true;

    return false;
};

/**
 * Summary: This function is used to check if input is valid array or not.
 * @param {*} input
 * @returns
 */
exports.isValidArray = function (input) {
    if (Array.isArray(input))
        return true;

    return false;
};

/**
 * Summary: This function is used to check if input array is empty or not.
 * @param {*} input
 * @returns
 */
exports.isEmptyArray = function (input) {
    if (Array.isArray(input) && input.length < 1)
        return true;

    return false;
};

/**
 * Summary: This function is used to check if input is valid number or not.
 * @param {*} input
 * @returns
 */
function isNumber(input) {
    return /^\d$/.test(input);
}

/**
 * Summary: This function is used to check if input is valid boolean or not.
 * @param {*} input
 * @returns
 */
exports.isValidBoolean = function (input) {
    if (input == true || input == "true" || input == false || input == "false")
        return true;

    return false;
};