'use strict';

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Router = express.Router();

const { UserService } = require('../../Services/User');
const User = new UserService();

/** @kind Router
 *  @type function
 *  @return Router
 */
const AuthRouter = () => {
  passport.use(
    new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },(username, password, done) => {
      console.log('finding by email route');
      User.findByUsername(username)
        .then((result) => {
          if (!result) return done(null, false);
          if (!result.validatePassword(password)) return done(null, false);
          return done(null, result);
        })
        .catch((err) => {
          if (err) done(null, false);
        });
    }),
  );

  passport.serializeUser((user, done) => {
    console.log('Serializing user');
    return done(null, user._id);
  });

  passport.deserializeUser((_id, done) => {
    console.log('deserializing user');

    if (!_id) {
      return done(null, null);
    }
    console.log('deserializing user');
    // return done(null, null);
    User.findById(_id, false, false)
      .then((result) => {
        return done(null, result);
      })
      .catch((err) => {
        return done(err);
      });
  });

  Router.post('/signup', (req, res, next) => {
    try {
      const userObj = {
        username: req.body.username,
        password: req.body.password,
      };
      console.log(userObj)

      if (
        // validation here
        true
        ) {
        User.createUser(userObj)
          .then((user) => {
            req.logIn(user, (err) => {
              console.log('in req login')
              if (err) {
              console.log('in req login err', err)
              return res.status(err.status || 200).json({
                  message: 'failure',
                  error: err
                });
              }
              return res.status(201).json({
                message: 'success',
                data: user.toAuthJSON(),
              });
            });
          })
          .catch((err) => {
            return res.status(err.status || 200).json({
              message: 'failure',
              error: err,
            });
          });
      } else {
        return null;
      }
    } catch (e) {
      return res.status(e.status || 400).json({
        message: 'failure',
        error:
          'Error creating user',
        errMsg: e
      });
    }
  });

  Router.post('/login', (req, res, next) => {
    return passport.authenticate(
      'local',
      { failureRedirect: '/' },
      (err, passportUser, info) => {

        console.log('User created, now logging in', passportUser, err, info, req.body);
        if (err) return next(err);
        if (!passportUser) {
          return res.status(401).json({
            message: 'failure',
            error: 'No user found',
          });
        }
        if (passportUser) {
          const user = passportUser;
          req.login(user, (err) => {
            if (err) {
              console.log('error here in login', err);
              return res.status(500).json({
                message: 'failure',
                error: err,
              });
            }
            if (user) {
              req.session.checkTokenUser = {
                email: user.email,
                id: user._id
              }
              res.setHeader(
                'Access-Control-Allow-Headers',
                'Content-Type, Origin, Accept',
              );
              res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN);
              res.setHeader('Access-Control-Allow-Credentials', true);
              return res
                .status(200)
                .cookie('token', user.jwt.toString(), {
                  maxAge: 360000000000000,
                  httpOnly: true,
                  secure: true,
                  sameSite: 'None',
                  domain: process.env.ORIGIN,
                  path: '/',
                })
                .json({
                  message: 'success',
                  data: user.toAuthJSON(),
                });
            } else {
              return res.status(404).json({
                message: 'failure',
                error: 'User not found',
              });
            }
          });
          return;
        }
        return res.status(400).json({
          message: 'Invalid username or password',
        });
      },
    )(req, res, next);
  });
};

Router.get('/logout', (req, res, next) => {
  // destroy req.session.userPayload
  if (req.session.userPayload) {
    req.session.userPayload = {};
  }
  // remove passport user
  if (req.session.passport) {
    req.session.passport.user = null;
  }
  // destroy req.session.passport
  req.logout();
  // send response of success back
  res.status(200).json({
    message: 'success',
    data: 'Successfully logged out',
  });
});

AuthRouter();

module.exports = Router;
