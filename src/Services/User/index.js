/* eslint-disable space-before-function-paren */
'use strict';

const { Users } = require('../../Model/index').Models;
const UserSchema = require('../../Model/Schema/User');

const { CustomError } = require('../../Errors/index');

const Errors = new CustomError();

/** Class User
 *  @kind class
 *  @return {Object} User - The user Object
 */
exports.UserService = class {
  constructor() {
    // initialize schema

    // check user exists
    this.checkUserExists = async (arg) => {
      return new Promise(async (resolve, reject) => {
        try {
          if (!arg) {
            return resolve(false);
          }
          console.log('result');
          return Users.findOne(arg, (err, userObj) => {
            console.log('result inside');
            if (err) {
              throw err;
            }
            if (userObj) {
              return resolve(true);
            }
            return resolve(false);
          });
        } catch (e) {
          return e;
        }
      });
    };

    // create new user
    this.createUser = (arg = {}) => {
      return new Promise(async (resolve, reject) => {
        console.log('in herre')
        await this.checkUserExists({ username: arg.username }).then(
          (result) => {
            if (result) {
              return reject(
                Errors.Error(
                  'AuthError',
                  400,
                  'Username already taken. Please try another',
                ),
              );
            }
          },
        );

        console.log(arg);
        if (!arg.password || !arg.username) {
          return reject(
            Errors.Error(
              'AuthError',
              400,
              'Request must contain password and username fields',
            ),
          );
        }
        if (arg.username.length >= 4 && arg.password.length >= 8) {
          const userSchema = new UserSchema(arg)
          if(!userSchema.validate()) return reject(Errors.Error('AuthError', 400, 'Create user called with incomplete args', err));

          const user = await new Users(userSchema.mapToModel());
          user.setPassword(arg.password);
          user.generateJWT();
          user.save((err) => {
            if (err) {
              reject(Errors.Error('AuthError', 400, 'Error saving user', err));
              return;
            }
            return resolve(user);
          });
          // });
          return;
        }
        reject(
          Errors.Error(
            'AuthError',
            400,
            'Email/Password cannot be shorter than 4/8 chars respectively',
          ),
        );
      });
    };

    // edit user
    this.editUser = (_id, arg) => {
      try {
        return new Promise(async (resolve, reject) => {
          if (!_id || !arg) {
            return reject(
              Errors.Error(
                'AuthError',
                400,
                'Request must contain _id and arguments',
              ),
            );
          }

          const filter = { _id };
          if (arg.password) {
            reject(
              Errors.Error(
                'AuthError',
                400,
                'You cannot edit user password via this route',
              ),
            );
            return;
          }
          if (arg.username) {
            await this.checkUserExists(arg).then((result) => {
              if (result) {
                return reject(
                  Errors.Error(
                    'AuthError',
                    400,
                    'Username already taken. Please try another',
                  ),
                );
              }
              return;
            });
          }
          if (arg.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const test = emailRegex.test(arg.email);
            if (!test) {
              return arg.email === '';
            } else
              return this.checkUserExists({ email: arg.email }).then(
                (result) => {
                  if (result) {
                    return reject(
                      'UserError',
                      400,
                      'Email taken. Please try another',
                    );
                  }
                },
              );
          }
          const user = await Users.findOneAndUpdate(filter, arg, {
            new: true,
          });
          if (!user) {
            return reject(Errors.Error('AuthError', 400, 'User not found'));
          }
          user.save((err) => {
            if (err) {
              reject(
                Errors.Error(
                  'AuthError',
                  500,
                  'Failed to save user after update - this.editUser',
                  err,
                ),
              );
              return;
            }

            return resolve(user);
          });
        });
      } catch (e) {
        return {
          message: 'failure',
          error: e,
        };
      }
    };

    // edit user password
    this.editUserPassword = (_id, arg) => {
      try {
        return new Promise(async (resolve, reject) => {
          if (!_id || !arg) {
            return reject(
              Errors.Error('AuthError', 400, 'Request must contain _id'),
            );
          }
          if (arg.password && arg.password.length >= 8) {
            const filter = { _id };
            const user = await Users.findOne(filter);
            // if (true) {
            if (user.validatePassword(arg.oldPassword)) {
              user.setPassword(arg.password);
              user.save((err) => {
                if (err) {
                  reject(
                    Errors.Error(
                      'AuthError',
                      500,
                      'Cannot set new password',
                      err,
                    ),
                  );
                  return;
                }
                return resolve(user);
              });
              return;
            }
            return reject(
              Errors.Error(
                'AuthError',
                400,
                'Please input correct current password',
              ),
            );
          } else {
            return reject(
              Errors.Error(
                'AuthError',
                400,
                'Password cannot be empty and must be greater than 8 chars',
              ),
            );
          }
        });
      } catch (err) {
        return {
          message: 'failure',
          error: err,
        };
      }
    };

    // find one user
    this.findByUsername = (username) => {
      try {
        return new Promise(async (resolve, reject) => {
          if (!username) {
            return reject(
              Errors.Error('AuthError', 400, 'Request must contain email'),
            );
          }
          console.log('finding email');
          await Users.findOne({ username }, async (err, user) => {
            if (err) {
              return reject(
                Errors.Error('AuthError', 500, 'Cannot find user', err),
              );
            }
            if (!user) {
              return reject(Errors.Error('AuthError', 500, 'Cannot find user'));
            }
            return resolve(user.exportMap());
          });
        });
      } catch (e) {
        return {
          message: 'failure',
          error: e,
        };
      }
    };

    // find by id
    /** findById
     *  @param id {String} ID - the user id to search
     *  @param populate{Boolean} populate - return user with populated fields
     * or not
     */
    this.findById = (_id, populate = false, resetToken = false) => {
      try {
        console.log('finding by id service');
        return new Promise(async (resolve, reject) => {
          if (!_id || _id === null) {
            return reject(
              Errors.Error('AuthError', 400, 'Request must contain _id'),
            );
          } else if (resetToken) {
            await Users.findById(_id, async (err, user) => {
              if (err) {
                reject(
                  Errors.Error(
                    'AuthError',
                    500,
                    'Cannot find user in database',
                    err,
                  ),
                );
                return;
              }
              await user.revokeJWT();
              await user.save((err) => {
                if (err) {
                  reject(
                    Errors.Error(
                      'AuthError',
                      500,
                      'Cannot save user in database after JWT revoke',
                      err,
                    ),
                  );
                  return;
                }
              });
              return resolve(user.toAuthJSON());
            });
          } else if (populate) {
            await Users.findById(_id, async (err, user) => {
              if (err) {
                reject(
                  Errors.Error(
                    'AuthError',
                    500,
                    'Cannot find user in database',
                    err,
                  ),
                );
                return;
              }

              if (user && populate) {
                // await user
                //   .execPopulate();
              }
              if (user) {
                return resolve(user.exportMap());
              } else {
                return reject(Errors.Error('AuthError', 404, 'User not found'));
              }
            });

            return;
          } else {
            await Users.findById(_id, async (err, user) => {
              if (err) {
                reject(
                  Errors.Error(
                    'AuthError',
                    500,
                    'Cannot find user in database',
                    err,
                  ),
                );
                return;
              }
              if (user) {
                return resolve(user.exportMap());
              } else {
                return reject(Errors.Error('AuthError', 404, 'User not found'));
              }
            });
          }
        });
      } catch (e) {
        return {
          message: 'failure',
          error: e,
        };
      }
    };

    // find all users
    this.getAll = () => {
      try {
        return new Promise(async (resolve, reject) => {
          await Users.find({}, (err, users) => {
            if (err) {
              reject(Errors.Error('AuthError', 500, 'Cannot find users', err));
              return;
            }
            return resolve(users);
          });
        });
      } catch (e) {
        return {
          message: 'failure',
          error: e,
        };
      }
    };
  }
};
