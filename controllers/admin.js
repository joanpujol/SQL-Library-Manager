const Book = require('../models/book');
var Op = require('sequelize').Op;

addBook = (title, author, genre, year) => {
    return Book.create({
        title,
        author,
        genre,
        year
    });
}

getBooks = (query, page, pageSize) => {
    let where = {};
    if(query) {
        where = getMatchingBooks(query);
    }

    return Book.findAndCountAll({
        where,
        limit: pageSize,
        offset: page * pageSize,
        raw : true
    });
}

getBook = (id) => {
    return Book.findOne({
        where: {
            id
        },
        raw : true
    });
}

deleteBook = (id) => {
    return Book.destroy({
        where: {
            id
        }
    });
}

updateBook = (book) => {
    const { id, title, author, genre, year} = book;
    return Book.update(
        { title, author, genre, year },
        { where: { id } }
    );
}

// Helper function to create a query to match anything containing a given query
const getMatchingBooks = (query) => {
    return {
        [Op.or]: [
            {title: {
                [Op.like]: `%${query}%`
            }},
            {author: {
                [Op.like]: `%${query}%`
            }},
            {genre: {
                [Op.like]: `%${query}%`
            }},
            {year: {
                [Op.like]: `%${query}%`
            }},
        ]
    }
}

module.exports = { addBook, getBooks, getBook, deleteBook, updateBook }
