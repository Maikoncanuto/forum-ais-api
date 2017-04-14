'use strict';

const Contact = require('../../model/contact');

class ContactDTO {

    static asDocument(contact) {
        return {
            id : contact.id,
            name: contact.name,
            email: contact.email,
            createdAt: contact.createdAt,
            phoneNumber: contact.phoneNumber,
            password: contact.password
        };
    }

    static asContact(document) {
        return new Contact({
            id: document._id,
            name: document.name,
            email: document.email,
            createdAt: document.createdAt,
            phoneNumber: document.phoneNumber,
            password: document.password
        });
    }
}

module.exports = ContactDTO;