const jwt = require("jsonwebtoken");
import model from "../models";
const { userAuthTokens } = model;

/**
 * Summary: This function check for the authentication of user every time any API call received in server this function will be call first and check for token which is passed in heade
 * If token is missing or not found then respective api call will be rejected.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const frontAuthenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  var messages = {
    authMessage: "Your session has been expired, Please login to continue"
  };

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, userData) => {
      if (err) {
        // Change token status when user not authorized
        await userAuthTokens.update(
          { status: "n" },
          { where: { token: token } }
        );

        messages.authMessage =
          "Your token is expired, Please login to continue";
        return res.status(403).send(messages);
      } else {
        if (userData && userData.email) {
          var tokenDetail = await userAuthTokens.findOne({
            where: { token: token, email: userData.email, status: "y" }
          });
          if (!tokenDetail) {
            // Change token status when user not authorized
            await userAuthTokens.update(
              { status: "n" },
              { where: { token: token } }
            );

            return res.status(401).send(messages);
          } else {
            req.user = userData;
            next();
          }
        } else {
          req.user = userData;
          next();
        }
      }
    });
  } else {
    return res.status(401).send(messages);
  }
};
