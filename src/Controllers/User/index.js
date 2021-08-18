'use strict';

// Import user services
const { UserService } = require('../../Services/User');
const userModel = require('../../Model/Schema/User');


// cloudinary config

/**
 * @type Class
 * @kind Controller
 * @extends User Service
 * @return controller class
 */
exports.UserController = class UserController extends UserService {
  constructor() {
    super();

    /** Get user by id
     *  @param req {Obj} - the request object
     *  @param res {Obj} - the response object
     *  @param next {Obj} - the next middleware in stack
     */
    this.findUserController = (req, res, next) => {
      const user_id = req.params.u_id;
      if (!user_id) {
        return res.status(400).json({
          message: 'failure',
          error: 'FindUser must be called with user_id',
        });
      }
      this.findById(user_id, true)
        .then((result) => {
          res.setHeader(
            'Access-Control-Allow-Origin',
            process.env.ORIGIN.toString(),
          );
          res.setHeader('Access-Control-Allow-Credentials', true);
          return res.status(200).json({
            message: 'success',
            data: result,
          });
        })
        .catch((err) => {
          return res.status(err.status).json({
            message: 'failure',
            error: err,
          });
        });
    };

    /** Get user by username
     *  @param req {Obj} - the request object
     *  @param res {Obj} - the response object
     *  @param next {Obj} - the next middleware in stack
     */
    this.findUsernameController = (req, res, next) => {
      const u_name = req.params.u_name;
      if (!u_name || typeof u_name !== 'string') {
        return res.status(400).json({
          message: 'failure',
          error: 'FindUser must be called with string user_id',
        });
      }
      this.findByUsername(u_name)
        .then((result) => {
          res.setHeader(
            'Access-Control-Allow-Origin',
            process.env.ORIGIN.toString(),
          );
          res.setHeader('Access-Control-Allow-Credentials', true);
          return res.status(200).json({
            message: 'success',
            data: result,
          });
        })
        .catch((err) => {
          return res.status(err.status).json({
            message: 'failure',
            error: err,
          });
        });
    };

    /** Check Usernames
     *  @param req {Obj} - the request object
     *  @param res {Obj} - the response object
     *  @param next {Obj} - the next middleware in stack
     */
    this.checkUniqueController = (req, res, next) => {
      let arg;
      if (req.body.username) {
        arg = { username: req.body.username };
      } else if (req.body.email) {
        arg = { email: req.body.email };
      }
      console.log(arg);
      if (!arg) {
        return res.status(400).json({
          message: 'failure',
          error: 'CheckUserNAME must be called with username',
        });
      }
      return this.checkUserExists(arg)
        .then((result) => {
          return res.status(200).json({
            message: 'success',
            data: result,
          });
        })
        .catch((err) => {
          return res.status(err.status || 400).json({
            message: 'failure',
            error: err,
          });
        });
    };

    // /** Add user
    //  *  @param req {Obj} - the request object
    //  *  @param res {Obj} - the response object
    //  *  @param next {Obj} - the next middleware in stack
    //  */
    // this.addUserController = (req, res, next) => {
    //   const userObj = {
    //     username: req.body.username,
    //     password: req.body.password,
    //   };
    //   if (!req.body.password || !req.body.username || typeof req.body.password !== 'String' || typeof req.body.username !== 'String') {
    //     return res.status(400).json({
    //       message: 'failure',
    //       error: 'req must contain string username and password',
    //     });
    //   }
    //   this.createUser(userObj)
    //     .then((result) => {
    //       return res.status(200).json({
    //         message: 'success',
    //         data: result,
    //       });
    //     })
    //     .catch((err) => {
    //       res.status(err.status || 400).json({
    //         message: 'failure',
    //         error: err,
    //       });
    //       return next(err);
    //     });
    // };

    /** find all users
     *  @param req {Obj} - the request object
     *  @param res {Obj} - the response object
     *  @param next {Obj} - the next middleware in stack
     */

    this.findAllUsersController = (req, res, next) => {
      return this.getAll()
        .then((result) => {
          return res.status(200).json({
            message: 'success',
            data: result,
          });
        })
        .catch((err) => {
          res.status(err.status || 500).json({
            message: 'failure',
            error: 'Cannot get all users',
            err,
          });
          return next(err);
        });
    };

    /** update user
     *  @param req {Obj} - the request object
     *  @param res {Obj} - the response object
     *  @param next {Obj} - the next middleware in stack
     */

    this.updateUserController = (req, res, next) => {
      const id = req.params.u_id;
      const update = req.body;

      for (let key in Object.keys(req.body)) {
        if (!key in ['username', 'password']) {
          return res.status(400).json({
            message: 'failure',
            error: 'req must contain only username and password',
          });
        }
      }

      if (!id || !update) {
        return res.status(400).json({
          message: 'failure',
          error: 'req must contain id and update',
        });
      }
      return this.editUser(id, update)
        .then((result) => {
          return res.status(200).json({
            message: 'success',
            data: result,
          });
        })
        .catch((err) => {
          res.status(err.status || 500).json({
            message: 'failure',
            error: err,
          });
          return next(err);
        });
    };


    /** update user password
     *  @param req {Obj} - the request object
     *  @param res {Obj} - the response object
     *  @param next {Obj} - the next middleware in stack
     */
    this.updateUserPasswordController = (req, res, next) => {
      const { password, oldPassword } = req.body;
      const arg = {
        password,
        oldPassword,
      };
      const _id = req.params.id;
      if (!_id || arg) {
        return res.status(400).json({
          message: 'failure',
          error: 'req must contain id and arg',
        });
      }
      return this.editUserPassword(_id, arg)
        .then((result) => {
          return res.status(200).json({
            message: 'success',
            data: result,
          });
        })
        .catch((err) => {
          res.status(err.status || 500).json({
            message: 'failure',
            error: err,
          });
          return next(err);
        });
    };
  }
};
