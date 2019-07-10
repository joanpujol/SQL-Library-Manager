const Sequelize = require('sequelize');

const db = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: 'library.db'
});

module.exports = db;
