'use strict';

const ContactService = require('./contact-service');
const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

class AuthService {

    constructor() {
        this._contactService = new ContactService();
    }

    get contactService() {
        return this._contactService;
    }

    authenticate(email, password) {
        return new Promise((resolve, reject) => {
            if (email && _.isString(email) && password && _.isString(password)) {
                this.contactService.findByEmail(email).then((contact) => {
                    if(contact) {
                        bcrypt.compare(password, contact.password, (error, matches) => {
                            if (error) {
                                reject(error);
                            }else {
                                if (matches) {
                                    resolve( {
                                        token: jwt.sign({ userId: contact.id }, process.env.JWT_SECRET, { algorithm: 'HS512', expiresIn: '7d' }),
                                        contact: contact
                                    });
                                } else {
                                    resolve(null);
                                }
                            }
                        });
                    }else {
                        resolve(null);
                    }
                }).catch((error) => {
                    reject(error);
                });
            }else {
                reject(new Error('The email and password are required and must strings'));
            }
        });
    }
}

module.exports = AuthService;