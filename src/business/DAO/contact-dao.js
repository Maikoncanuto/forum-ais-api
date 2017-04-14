'use strict';

// const Contact = require('../../model/contact');
const ContactDTO = require('../DTO/contact-dto');
const db = require('../../data/neo4j');
const bcrypt = require('bcrypt-nodejs');
const _ = require('lodash');

class ContactDAO {

    save(contact) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(contact.password, null, null, (error, hash) => {
                if (error) {
                    return reject(error);
                } else {
                    contact.password = hash;
                    contact.createdAt = new Date();
                    this._save(contact).then((createdContact) => {
                        resolve(createdContact);
                    }).catch((error) => {
                        reject(error);
                    });
                }
            });
        });
    }

    update(contact) {
        return new Promise((resolve, reject) => {
            if (_.isInteger(contact.id)) {
                this.contactById(contact.id)
                    .then((foundContact) => {
                        if (foundContact) {
                            foundContact.name = contact.name;
                            foundContact.phoneNumber = contact.phoneNumber;
                            db.save(ContactDTO.asDocument(foundContact),
                                (error, node) => {
                                    if (error) {
                                        reject(error);
                                    } else {
                                        resolve(ContactDTO.asContact(node));
                                    }
                                });
                        } else {
                            resolve(null);
                        }
                    }).catch((error) => {
                        reject(error);
                    });
            } else {
                reject(new Error('Contact must have an id to be deleted'));
            }
        });
    }

    delete(contact) {
        return new Promise((resolve, reject) => {
            if (_.isInteger(contact.id)) {
                this.contactById(contact.id).then((foundContact) => {
                    if (foundContact) {
                        db.delete(foundContact.id, (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(foundContact);
                            }
                        });
                    } else {
                        resolve(null);
                    }
                }).catch((error) => {
                    reject(error);
                });
            } else {
                reject(new Error('Contact must have an id to be deleted'));
            }
        });
    }

    findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.find({ email: email }, false, 'Contact', (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if (!_.isEmpty(result)) {
                        resolve(ContactDTO.asContact(_.first(result)));
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    contactById(contactId) {
        return new Promise((resolve, reject) => {
            let cypher = `MATCH (c: Contact) WHERE ID(c)=${contactId} RETURN c`;
            db.query(cypher, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if (_.isEmpty(result)) {
                        resolve(null);
                    } else {
                        let node = _.first(result);
                        resolve(ContactDTO.asContact(node));
                    }
                }
            });
        });
    }

    allContacts() {
        return new Promise((resolve, reject) => {
            db.find({}, false, 'Contact', (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if (!_.isEmpty(result)) {
                        resolve(result.map((node) => { return ContactDTO.asContact(node); }));
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    _save(contact) {
        return new Promise((resolve, reject) => {
            db.save(ContactDTO.asDocument(contact), 'Contact',
                (error, node) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(ContactDTO.asContact(node));
                    }
                });
        });
    }

}

module.exports = ContactDAO;