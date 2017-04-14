'use strict';
const Joi = require('joi');
const _ = require('lodash');

class ValidationExpress {

    constructor() {

    }

    static validate(schema) {
        return (req, res, next) => {
            Joi.validate(req.body, schema, (error) => {
                if (error) {
                    res.status(400).json({
                        message: error.details[0].message
                    });
                } else {
                    next();
                }
            });
        };
    }

    static validateIntegerParam(name) {
        return (req, res, next) => {
            if (!_.isNaN(req.params[name])) {
                next();
            } else {
                res.status(400).send({ message: `Path parameter ${name} must be an integer`});
            }
        };
    }
}

module.exports = ValidationExpress;