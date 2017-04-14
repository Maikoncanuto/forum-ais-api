'use strict';

const _ = require('lodash');

// Id

// Nome

// Email

// Telefone : Modelo com uma string  chamada phoneNumber

class Contact {

    constructor(data) {
        if(data) {
            this.id = data.id;
            this.name = data.name;
            this.email = data.email;
            this.phoneNumber = data.phoneNumber;
            this.password = data.password;
        }
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get phoneNumber() {
        return this._phoneNumber;
    }

    set phoneNumber(value) {
        this._phoneNumber = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    asObject() {
        let obj = {};
        _.keys(this).forEach((k) => {
            if (k.startsWith('_')) {
                let newKey = k.slice(1, k.length);
                obj[newKey] = this[newKey];
            }
        });
        return obj;
    }
}

module.exports = Contact;