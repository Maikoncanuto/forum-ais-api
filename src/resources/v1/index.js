'use strict';
const express = require('express');
const ContactService = require('../../business/service/contact-service');
const AuthService = require('../../business/service/auth-service');
const passport = require('passport');
const Validator = require('../../business/validation/validation-express');
const ValiditionSchemaProvider = require('../../business/validation/validation-schemas');

const Contact = require('../../business/model/contact');

class IndexResource {

    constructor() {
        this._router = express.Router();
        this._contactService = new ContactService();
        this._authService = new AuthService();
        this._validationSchemas = new ValiditionSchemaProvider();
        this._setup();
    }

    get contactService() {
        return this._contactService;
    }

    get authService() {
        return this._authService;
    }

    get validationSchemas() {
        return this._validationSchemas;
    }

    _setup() {
        this._setupCreateResource();
        this._setupUpdateResource();
        this._setupDeleteResource();
        this._setupGetAllResource();
        this._setupGetById();
        this._setupAuthResource();
    }

    get router() {
        return this._router;
    }

    _setupCreateResource() {
        this.router.post('/',
            Validator.validate(this.validationSchemas.contactCreateSchema),
            (req, res, next) => {
                this.contactService.findByEmail(req.body.email).then((contact) => {
                    if (contact) {
                        res.status(400).send({ message: `e-mail ${req.body.email} is already registered` });
                    } else {
                        next();
                    }
                }).catch(() => {
                    this._internalErrorResponse(res);
                });
            },
            (req, res) => {
                let contact = new Contact(req.body);
                this.contactService.save(contact).then((savedContact) => {
                    res.status(201).send(savedContact.asObject());
                }).catch(() => {
                    this._internalErrorResponse(res);
                });
            });
    }

    _setupUpdateResource() {
        this.router.put('/:contactId',
            passport.authenticate('bearer', { session: false }),
            Validator.validateIntegerParam('contactId'),
            Validator.validate(this.validationSchemas.contactUpdateSchema),
            (req, res) => {
                let contact = new Contact(req.body);
                contact.id = parseInt(req.params.contactId);
                this.contactService.update(contact).then((updatedContact) => {
                    if (updatedContact) {
                        res.send(updatedContact.asObject());
                    } else {
                        res.status(404).send({ message: 'Contact not found' });
                    }
                }).catch(() => {
                    this._internalErrorResponse(res);
                });
            });
    }

    _setupDeleteResource() {
        this.router.delete('/:contactId',
            passport.authenticate('bearer', { session: false }),
            Validator.validateIntegerParam('contactId'),
            (req, res) => {
                let contact = new Contact({ id: parseInt(req.params.contactId) });
                this.contactService.delete(contact).then((updatedContact) => {
                    if (updatedContact) {
                        res.send(updatedContact.asObject());
                    } else {
                        res.status(404).send({ message: 'Contact not found' });
                    }
                }).catch(() => {
                    this._internalErrorResponse(res);
                });
            });
    }

    _setupGetById() {
        this.get('/:contactId',
            passport.authenticate('bearer', { session: false }),
            Validator.validateIntegerParam('contactId'),
            (req, res) => {
                this.contactService.findById(parseInt(req.params.contactId)).then((foundContact) => {
                    if (foundContact) {
                        res.send(foundContact.asObject());
                    } else {
                        res.status(404).send();
                    }
                }).catch(() => {
                    this._internalErrorResponse(res);
                });
            });
    }

    _setupGetAllResource() {
        this.router.get('/',
            passport.authenticate('bearer', { session: false }),
            (req, res) => {
                this.contactService.allContacts().then((contacts) => {
                    res.send(contacts.map((contact) => { return contact.asObject(); }));
                }).catch(() => {
                    this._internalErrorResponse(res);
                });
            });
    }

    _setupAuthResource() {
        this.router.post('/auth', (req, res, next) => {
            if (req.headers.email && req.headers.password) {
                next();
            } else {
                res.status(400).send({ message: 'Email and password are required params' });
            }
        }, (req, res) => {
            this.authService.authenticate(req.headers.email, req.headers.password).then((authSession) => {
                if (authSession) {
                    res.setHeader('token', authSession.token);
                    res.send(authSession.contact.asObject());
                } else {
                    res.status(401).send();
                }
            });
        });
    }

    _internalErrorResponse(response) {
        response.status(500).send({ message: 'internal error' });
    }

}
module.exports = IndexResource;
