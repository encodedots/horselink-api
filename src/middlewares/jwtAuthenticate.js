const jwt = require('jsonwebtoken');
import { async } from 'regenerator-runtime';
import model from '../models';
const { adminUser } = model;

/**
 * Summary: This function check for the authentication of user every time any API call received in server this function will be call first and check for token which is passed in heade
 * If token is missing or not found then respective api call will be rejected.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    var messages = {};

    if (authHeader) {
        const token = await authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err) => {
        
            if (err) {
                // Change token status when user not authorized
                messages.authMessage = "Your token is expired, Please login to continue11"
                return res.status(403).send(messages);
            } else {
                // if (userData && userData.email) {
                    var tokenDetail = await adminUser.findOne({ where: { token: token, isDeleted: "n", isActive:"y"} })
                    if (!tokenDetail) {
                        return res.status(401).send(messages);
                    } else {
                        req.user = tokenDetail;
                        next();
                    }
               
            }
        });
    } else {
        return res.status(401).send(messages);
    }
};