'use strict';
let Joi = require('joi');

class ValidationSchemas {

    constructor() {
        this._setupContactCreateSchema();
        this._setupContactUpdateSchema();
    }

    get contactCreateSchema() {
        return this._contactCreateSchema;
    }

    get contactUpdateSchema() {
        return this._contactUpdateSchema;
    }

    //User schema
    _setupContactCreateSchema() {
        this._contactCreateSchema = Joi.object({
            name: Joi.string().required().min(2),
            email: Joi.string().email().required(),
            phoneNumber: Joi.string().regex(/[\\d{8,15}]/),
            password: Joi.string().required().min(6),
        });
    }

    _setupContactUpdateSchema() {
        this._contactUpdateSchema = Joi.object({
            name: Joi.string().required().min(2),
            phoneNumber: Joi.string().regex(/[\\d{8,15}]/)
        });
    }
}

module.exports = ValidationSchemas;