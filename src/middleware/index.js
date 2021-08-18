'use strict';

const jwt = require('jsonwebtoken');

const { UserService } = require('../Services/User');

const User = new UserService();
/** @kind middleware
 *  @type function
 *  @return LoggedIn ?
 */
 exports.checkToken = (req, res, next) => {
    // get jwt from header
    const headerToken = req.headers.authorization;
    const req_id = req.params.u_id;
  
    if (!req.session.checkTokenUser) {
      return res.status(401).json({
        message: 'failure',
        error: {
          message: 'No user in session. Unauthorized, please login.',
        },
      });
    }
  
    // //sign jwt to get user_id and session info
  
    if (headerToken) {
      const token = headerToken.split(' ')[1];
      jwt.verify(
        token,
        process.env.JWT_SECRET,
        { issuer: process.env.JWT_ISSUER },
        (err, verified) => {
          if (err) {
            return res.status(401).json({
              message: 'failure',
              error: {
                message: 'Error verifying token. Token is invalid',
                err,
              },
            });
          }
  
          User.findById(verified.id)
            .then((res) => {
              if (token !== res.jwt) {
                return res.status(401).json({
                  message: 'failure',
                  error: 'Token is invalid. Please try again',
                });
              }
              return;
            })
            .catch((err) => {
              if (err) {
                return res.status(400).json({
                  message: 'failure',
                  error: 'Error finding user',
                });
              }
              return;
            });
  
          if (req.session.checkTokenUser.id === verified.id) {
            if (req_id && (verified.id !== req_id)) {
              return res.status(401).json({
                message: 'failure',
                error: {
                  message:
                    'You token is not authorized for session. Please login',
                },
              });
            }
            req.session.userPayload = {
              id: verified.id,
              email: verified.email,
            };
            return next();
          }
          return res.status(401).json({
            message: 'failure',
            error: {
              message: 'You token is not authorized for session. Please login',
            },
          });
        },
      );
      return;
    }
    return res.status(400).json({
      message: 'failure',
      error: {
        message: 'Route requires a token. Please send with Auth Header',
      },
    });
};