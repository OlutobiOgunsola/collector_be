'use strict';

const express = require('express');
const Router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Import user services
const { UserController } = require('../../Controllers/User');

// Import token middleware
const { checkToken, checkLogin } = require('../../middleware');


/** Initialize user class
 *  @kind Router
 *  @type class
 *  @return Router {Object} - Router object
 */

class UserRouter extends UserController {
  constructor() {
    super();

    // Router.post('/add', this.addUserController);
    Router.post('/verify', this.checkUniqueController);

    Router.put('/edit/:u_id', this.updateUserController);
    Router.put('/edit/password/:u_id', this.updateUserPasswordController);
    Router.get('/all', this.findAllUsersController);
    Router.get('/:u_id', this.findUserController);
    Router.get('/user/:u_name', this.findUsernameController);
    // Route to remove user

    return Router;
  }
}

const userRouter = new UserRouter();
userRouter;

// Router.get('/', (req, res) => {
//   console.log('Gotten');
// });

module.exports = Router;
