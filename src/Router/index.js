const express = require('express');
const Router = express.Router();

const AuthRouter = require('./Auth')
const UserRouter = require('./User')
const ElectionRouter = require('./Elections')

exports.AppRouter = class AppRouter {
    constructor() {
        
        Router.use('/auth', AuthRouter);
        Router.use('/users', UserRouter);
        Router.use('/elections', ElectionRouter);
        return Router;
    }
}