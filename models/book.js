var Sequelize = require('sequelize');

var db = require('../utils/database');

const Book = db.define('book', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,

    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 100]
        }
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 50]
        }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER,
});

module.exports = Book;
