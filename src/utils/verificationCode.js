import crypto from 'crypto';
/**
 * This function will return random string when we generate Verification Code
 * @param length
 * @param type
 * @returns {string}
 */
export default (length = 6) => {
    if (!(length >= 0 && Number.isFinite(length))) {
        throw new TypeError('Expected a `length` to be a non-negative finite number');
    }
    // Generating entropy is faster than complex math operations, so we use the simplest way
    const randomNumber = (Math.floor(100000 + Math.random() * 900000))

    return randomNumber
}
