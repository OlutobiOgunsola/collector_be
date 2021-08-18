'use strict'

module.exports = class User {
    constructor(userObj) {
        this._username = userObj.username;
        this._password = userObj.password; // this will be the hashed password

        this.validate = () => {
            return this._username !== '' &&
            this._password !== ''
        };
        this.mapToModel = () => ({
            username: this._username,
            password: this._password,
        });
    }
}