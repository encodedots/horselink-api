/**
 * Summary: This file is used to manage the constant messages that are used in overall application to send in response.
 */
export default {
  // Authentication messages
  ACCOUNT_SUSPENDED: "Your account has been suspended. Contact admin",
  ACCOUNT_DEACTIVATED:
    "Your account has been deactivated. Please contact admin",
  ACCOUNT_DELETED: "Your account has been deleted. Contact admin",
  INCORRECT_LOGIN_CREDENTIALS:
    "Incorrect login credentials. Kindly check and try again",
  REGISTER_SUCCESSFULLY: "Register successful",
  LOGIN_SUCCESSFULLY: "Login successful",
  LOGOUT_SUCCESSFULLY: "Logout successful",
  MAIL_SENT_SUCCESSFULLY: "Mail sent successfully",
  VERIFY_ACCOUNT: "Please verify your account",
  // Common messages
  COULD_NOT_PERFORM_ACTION:
    "Could not perform operation at this time, kindly try again later.",
  NOT_FOUND: "Data not found",
  SOMETHING_WENT_WRONG: "Something Went Wrong",
  INVALID_PARAMETERS: "Invalid parameters",
  PASSWORD_VALIDATION_ERROR:
    "Password must be at least one uppercase, lowercase, special character and number",
  PASSWORD_RESET_EMAIL_SENT_SUCCESSFULLY:
    "Password reset link sent! You'll receive an email if you are registered on our system.",
  PASSWORD_RESET_SUCCESSFULLY: "Password has been reset successfully",
  RESET_TOKEN_EXPIRED:
    "Your token has been expired. Kindly check and try again",
  PROFILE_NOT_FOUND: "User profile does not exist",

  // Email Messages
  EMAIL_SUBJECT_RESET_PASSWORD: "Password Reset",
  EMAIL_SUBJECT_CHARITY_REQUEST: "Free charity account request",
  EMAIL_SUBJECT_VERIFY_EMAIL_ADDRESS: "Email Verification",
  EMAIL_SUBJECT_VERIFY_ACCOUNT: "Verify account for signup",
  ACCOUNT_ALREADY_VERIFIED: "Your account is already verified",
  ACCOUNT_VERIFIED: "Your account is verified",
  ACCOUNT_NOT_VERIFIED: "Account is not verified yet",
  ACCOUNT_NOT_ACTIVATED: "This account is not activated",
  USER_EMAIL_UPDATED_SUCCESSFULLY: "Email updated successfully",
  CONTACT_REQUEST: "Contact request",
  REPORT_REQUEST: "Report request",
  HELP_REQUEST: "Help request",
  GDPR_REQUEST: "GDPR request",

  // Create/Update user Messages
  USER_ALREADY_EXIST: "User already exist",
  USER_DOES_NOT_EXIST: "User does not exist",
  EMAIL_USER_ALREADY_EXIST: "Email you have entered is already exists",
  USER_NAME_ALREADY_EXISTS: "User name you have entered is already exists",
  EMAIL_USER_NAME_ALREADY_EXIST:
    "Email and User name you have entered is already exists",
  INCORRECT_EMAIL_ADDRESS: "Email you have entered is incorrect",
  INCORRECT_EMAIL: "Email is incorrect",

  // CRUD success/error messages
  RETRIEVE_SUCCESSFULLY: "Retrieved data successfully",
  CREATED_SUCCESSFULLY: "Created successfully",
  UPDATED_SUCCESSFULLY: "Updated successfully",
  DELETED_SUCCESSFULLY: "Deleted successfully",
  CREATED_USER_SUCCESSFULLY: "User created successfully",
  UPDATED_USER_SUCCESSFULLY: "User detail updated successfully",
  CREATED_FAQ_SUCCESSFULLY: "FAQ created successfully",
  UPDATED_FAQ_SUCCESSFULLY: "FAQ detail updated successfully"
};
