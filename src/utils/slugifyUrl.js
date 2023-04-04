import slugify from 'slugify';

/**
 * Summary : This function will create a slug for the page redirection
 * @param title
 * @returns {Promise<string>}
 */
exports.slugifyUrl = async function (title) {
    return slugify(title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
        locale: 'vi',
        trim: true
    });
};

/**
 * Summary : This function will create a slug for the user name
 * @param title
 * @returns {Promise<string>}
 */
exports.slugifyUsername = async function (title) {
    title = title.replaceAll("ä", "ae");
    title = title.replaceAll("ö", "oe");
    title = title.replaceAll("ü", "ue");

    return title.replace(/[^A-Z0-9]/ig, "").toLowerCase();
};


