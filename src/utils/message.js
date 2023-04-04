/**
 * Summary: This file is used to manage the constant messages that are used in overall application to send in response.
 */
export default {
  // Authentication messages
  NOT_VERIFY_ACCOUNT: 'Your account has not been actived. Please verify your account',
  ACCOUNT_SUSPENDED: 'Your account has been suspended. Contact admin',
  ACCOUNT_DELETED: 'Your account has been deleted. Contact admin',
  INCORRECT_LOGIN_CREDENTIALS: 'Incorrect login credentials. Kindly check and try again',
  SIGN_UP_EMAIL: "Please verify your email address to login",
  // EMAIL_VERIFIED: "The verification code has been sent to your email address",
  USER_VERIFIED_SUCCESSFULLY: "User verfied successfully",
  INVALID_VERIFICATION_CODE: 'Entered code is invalid',
  USER_REGISTERED_SUCCESSFULLY: "Registered successfully",
  PASSWORD_RESET_SUCCESSFULLY: 'Password has been reset successfully',
  INVALID_TOKEN: 'Invalid Token',
  LOGIN_SUCCESSFULLY: 'Login  successful',
  LOGOUT_SUCCESSFULLY: "Logout successful",
  FORBIDDEN: "Forbidden",
  EMAIL_ALREADY_UPDATED: 'Email is already updated',
  USER_EMAIL_VERIFIED_SUCCESSFULLY: "Your email address has been verfied successfully",
  USER_EMAIL_UPDATED_SUCCESSFULLY: "Your email address has been verfied successfully",
  USER_PASSWORD_UPDATED_SUCCESSFULLY: "Your password has been updated successfully",
  PASSWORD_NOT_MATCH: 'Your entered password is incorrect',

  // Common messages
  COULD_NOT_PERFORM_ACTION: 'Could not perform operation at this time, kindly try again later.',
  NOT_FOUND: 'Data not found',
  SOMETHING_WENT_WRONG: "Something Went Wrong",
  INVALID_PARAMETERS: 'Invalid parameters',
  SUCCESSFUL: 'Successful',

  // Email Messages
  EMAIL_SUBJECT_VERIFY_USER: 'Verification',
  EMAIL_SUBJECT_VERIFY_EMAIL_ADDRESS_EN: 'Email Verification',
  EMAIL_SUBJECT_VERIFY_EMAIL_ADDRESS_DE: 'EMail Verifizierung',
  EMAIL_SUBJECT_VERIFY_EMAIL_ADDRESS_REGISTER_EN: 'Please confirm your email address',
  EMAIL_SUBJECT_VERIFY_EMAIL_ADDRESS_REGISTER_DE: 'Bitte bestätige deine Email Adresse',
  PASSWORD_RESET_EMAIL_SENT_SUCCESSFULLY: 'Password reset link sent! You\'ll receive an email if you are registered on our system.',
  EMAIL_SUBJECT_RESET_PASSWORD_EN: 'Password Reset',
  EMAIL_SUBJECT_RESET_PASSWORD_DE: 'Passwort zurücksetzen',
  EMAIL_SUBJECT_PASSWORD_UPDATE_EN: 'Password Updated',
  EMAIL_SUBJECT_PASSWORD_UPDATE_DE: 'Kennwortaktualisierung',
  EMAIL_SUBJECT_USER_ACCOUNT_CREATED_BY_ADMIN: "Your account has been created by horsemapp Admin",
  EMAIL_SUBJECT_ACCOUNT_DELETE_EN: 'Account Delete',
  EMAIL_SUBJECT_ACCOUNT_DELETE_DE: 'Konto löschen',
  EMAIL_SUBJECT_ACCOUNT_CREATE_EN: 'Welcome to Horsemapp',
  EMAIL_SUBJECT_ACCOUNT_CREATE_DE: 'Willkommen bei Horsemapp',
  EMAIL_SUBJECT_CHANGE_PASSWORD_EN: 'Password Change',
  EMAIL_SUBJECT_CHANGE_PASSWORD_DE: 'Passwortänderung',


  // Create/Update user Messages
  USER_DOES_NOT_EXIST: 'User does not exist',
  USER_ALREADY_EXIST: 'User already exist',
  EMAIL_USER_ALREADY_EXIST: 'Email you have entered is already exists',
  USER_NAME_ALREADY_EXISTS: 'User name you have entered is already exists',
  INCORRECT_EMAIL_ADDRESS: 'Email you have entered is incorrect',

  // CRUD success/error messages
  RETRIEVE_SUCCESSFULLY: 'Retrieved data successfully',
  CREATED_SUCCESSFULLY: 'Created successfully',
  UPDATED_SUCCESSFULLY: 'Updated successfully',
  DELETED_SUCCESSFULLY: 'Deleted successfully',
  REFERENCE_EXIST: 'Data can not be deleted, please delete references first',

  // Create/Update post Messages
  POST_DOES_NOT_EXIST: 'Post does not exist',
  NOTIFICATION_DOES_NOT_EXIST: 'Notification does not exist',

  // Post Management
  POST_BOOKMARK_SUCCESSFULLY: "Post Bookmark successfully",
  POST_REMOVE_BOOKMARK_SUCCESSFULLY: "Remove post Bookmark successfully",
  LIKE_POST_SUCCESSFULLY: "Post like successfully",
  UNLIKE_POST_SUCCESSFULLY: "Post unlike successfully",
  USER_FOLLOW_ALREADY: "Already follow this User",
  USER_FOLLOW_SUCCESSFULLY: "User follow successfully",
  USER_UNFOLLOW_SUCCESSFULLY: "User unfollow successfully",
  USER_NOT_FOLLOW: 'User does not follow yourself',
  USER_BLOCK_SUCCESSFULLY: "User blocked successfully",

}