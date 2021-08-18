'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Schema } = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      // required: [true, 'User must have firstname'],
      trim: true,
      minlength: 4,
      maxlength: 24,
    },
    password: {
      type: String,
      required: [true, 'User must have password'],
    },
    salt: {
      type: String,
      required: [true, 'User must have salt'],
    },
    jwt: {
      type: String,
    },

  },
  { strictQuery: true, timestamps: true },
);

// Defile set usefindandmodify
/** @kind config
 *  @class findandmodify
 *  @return Schema methods
 */
mongoose.set('useFindAndModify', false);

/** Set password
 *  @param password {String} - the password to be set
 *  @return Object {Object} - User document with hashed password set
 */

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

/** Validate password
 *  @param password {String} - the password to validated
 *  @return Object {Object} - Password validated
 */

userSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.password === hash;
};

/** Generate jsonWebToken
 *  @return Token {String} - JWT
 */

userSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  this.jwt = jwt.sign(
    {
      email: this.email,
      id: this._id,
      iss: process.env.JWT_ISSUER,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    process.env.JWT_SECRET,
  );
  return null;
};

userSchema.methods.revokeJWT = function () {
  this.jwt = null;
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  this.jwt = jwt.sign(
    {
      u_name: this.username,
      id: this._id,
      iss: process.env.JWT_ISSUER,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    process.env.JWT_SECRET,
  );
  return null;
};

/** Model to auth
 *  @return Object {Object} - User model
 */

userSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    jwt: this.jwt,
  };
};

userSchema.methods.exportMap = function () {
  // export assets
  const final = Object.assign({}, this._doc);
  final._id = this._id;
  final.jwt = this.jwt;
  final.save = () => {
    return this.save();
  };
  final.validatePassword = (password) => {
    return this.validatePassword(password);
  };
  final.toAuthJSON = () => {
    return this.toAuthJSON();
  };
  delete final.password;
  delete final.salt;
  return final;
};

// userSchema.plugin(uniqueValidator);

userSchema.pre('remove', async next => {
  // await this.model('Calculation').deleteMany({ user: this._id }, next);
  // await this.model('Transactions').deleteMany({ user: this._id }, next);
  // await this.model('Comments').deleteMany({ user: this._id }, next);
});
module.exports.Users = mongoose.model('Users', userSchema);
