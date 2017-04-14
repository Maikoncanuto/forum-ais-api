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
            if (contact.id) {
                this.contactById(contact.id)
                    .then((foundContact) => {
                        if (foundContact) {
                            foundContact.name = contact.name;
                            foundContact.phoneNumber = contact.phoneNumber;
                            this._save(foundContact).then((updatedContact) => {
                                resolve(updatedContact);
                            }).catch((error) => {
                                reject(error);
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
            if (contact.id) {
                db.delete(contact.id, (error, deletedNode) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (deletedNode) {
                            resolve(ContactDTO.asContact(deletedNode));
                        } else {
                            resolve(null);
                        }
                    }
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

    contactById(userId) {
        return new Promise((resolve, reject) => {
            db.read({ id: userId }, (error, node) => {
                if (error) {
                    reject(error);
                } else if (node) {
                    resolve(ContactDTO.asContact(node));
                } else {
                    resolve(null);
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

    _save(user) {
        return new Promise((resolve, reject) => {
            user.registeredAt = new Date();
            db.save(ContactDTO.asDocument(user), 'Contact', (error, node) => {
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