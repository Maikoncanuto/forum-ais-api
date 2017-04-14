'use strict';

const Seraph = require('seraph');
const db = Seraph({
    server: process.env.NEO4J_HOST,
    user: process.env.NEO4J_USER,
    pass: process.env.NEO4J_PASS
});

module.exports = db;