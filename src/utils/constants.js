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

   /* SPORT TYPE TABLE DATA */
   SPORT_TYPE_DRESSAGRE: 'Dressage',
   SPORT_TYPE_DRIVING: 'Driving',
   SPORT_TYPE_JUMPING: 'Jumping',
   SPORT_TYPE_RACING: 'Racing',
   SPORT_TYPE_EVENTING: 'Eventing',
   SPORT_TYPE_SHOWING: 'Showing',
   SPORT_TYPE_WESTERN: 'Western',
   SPORT_TYPE_PLEASURE: 'Pleasure',

   SPORT_TYPE_DRESSAGRE_GERMAN: 'Dressur',
   SPORT_TYPE_DRIVING_GERMAN: 'Fahren',
   SPORT_TYPE_JUMPING_GERMAN: 'Springen',
   SPORT_TYPE_RACING_GERMAN: 'Rennen',
   SPORT_TYPE_EVENTING_GERMAN: 'Vielseitigkeit',
   SPORT_TYPE_SHOWING_GERMAN: 'Zeigen',
   SPORT_TYPE_WESTERN_GERMAN: 'Western',
   SPORT_TYPE_PLEASURE_GERMAN: 'Vergnügen',
   /* SPORT TYPE TABLE DATA */

   /* NOTIFICATION TABLE DATA */
   NEW_FOLLOWING_NOTIFICATION: 'new-following',
   POST_LIKE_NOTIFICATION: 'post-like',
   /* NOTIFICATION TABLE DATA */
}