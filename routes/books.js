// Third party imports
const express = require("express");

const router = express.Router();

// Local imports
const db = require('../utils/database');
const raiseNotFoundError = require('../utils/not-found');
const admin = require('../controllers/admin');

// Setting variable
const pageSize = 10;

router.get('/', (req, res, next) => {
    // Query string check
    let query = ""
    if(req.query.q) {
        query = req.query.q;
    }

    let currentPage = 0
    if(req.query.p) {
        currentPage = req.query.p;
    }

    const topic = query ? query : "everything!";
    const pageTitle = `Books about ${topic}`;
    syncDBAndExecute(() => {
        admin.getBooks(query, currentPage, pageSize).then((result) => {
            const pageNumber = Math.ceil(result.count / pageSize)
            const pageRange = [...Array(pageNumber).keys()];

            if(pageNumber > currentPage || query) {
                res.render('index', {books: result.rows, pageTitle, pageRange, currentPageUrl: `/books/?q=${query}`});
            } else {
                raiseNotFoundError(next);
            }
        });
    });
});

router.get('/new', (req, res, next) => {
    res.render("new-book", {pageTitle: "Enter a new book into the databse"});
});

router.post('/new', (req, res, next) => {
    const { title, author, genre, year } = req.body
    syncDBAndExecute(() => {
        admin.addBook(title, author, genre, year).then(() => {
            res.redirect('/books');
        }).catch((exception) => {
            const errors = getValidationErrors(exception);
            res.render("new-book", {pageTitle: "Enter a new book into the databse", errors});
        });
    });
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    syncDBAndExecute(() => {
        admin.getBook(id).then((book) => {
            res.render('update-book', {book, pageTitle: "Book details"});
        });
    });
});

router.post('/:id', (req, res, next) => {
    const { id } = req.params;
    const { title, author, genre, year } = req.body;
    const book = {
        id,
        title,
        author,
        genre,
        year
    }

    syncDBAndExecute(() => {
        admin.updateBook(book).then(() => {
            res.redirect('/books/' + id);
        }).catch((exception) => {
            const errors = getValidationErrors(exception);
            res.render('update-book', {book, pageTitle: "Book details", errors});
        });
    });
});

router.post('/:id/delete', (req, res, next) => {
    const { id } = req.params;
    syncDBAndExecute(() => {
        admin.deleteBook(id).then(() => {
            res.redirect('/books');
        });
    })
});

// Helper function get a list of validation errors
const getValidationErrors = (exception) => {
    let errors = [];
    if(exception.errors) {
        exception.errors.forEach(error => {
            const { message } = error;
            errors.push(message);
        });
    }
    return errors;
}

// Syncs database and executes operation on it
const syncDBAndExecute = (func) => {
    db.sync().then(() => {
        func();
    });
}

module.exports = router;
