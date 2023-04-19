/**
 * Summary: This section manages constants that is used in overall functionality.
 */
export default {
   /* Database Table Name */
   POSTS: "posts",
   POST_FILES: "postFiles",
   USERS: "users",
   USER_POST_BOOKMARKS: "userPostBookmarks",
   USER_FOLLOWS: "userFollows",

   RECORD_LIMIT: 18,

   DEFAULT_LANG: 'de',
   PRIVATE_USER: 'private',
   BUSINESS_USER: 'business',


   /* DEFAULT ADMIN USER DATA */
   ADMIN_USER_NAME: 'admin',
   ADMIN_USER_EMAIL: process.env.EMAIL_ADMIN,
   ADMIN_USER_PASSWORD: 'Etpl@852',
   /* DEFAULT ADMIN USER DATA */
}