'use strict';

const ContactDAO = require('../DAO/contact-dao');

class ContactService {
    constructor() {
        this._contactDAO = new ContactDAO();
    }

    get contactDAO() {
        return this._contactDAO;
    }

    save(contact) {
        return this.contactDAO.save(contact);
    }

    update(contact) {
        return this.contactDAO.update(contact);
    }

    delete(contact) {
        return this.contactDAO.delete(contact);
    }

    findById(id) {
        return this.contactDAO.findById(id);
    }

    findByEmail(email) {
        return this.contactDAO.findByEmail(email);
    }

    allContacts() {
        return this.contactDAO.allContacts();
    }

}  

module.exports = ContactService;