// Third party imports
const express = require("express");

// Express instance
const app = express();

// Local imports
const booksRouter = require("./routes/books");
const raiseNotFoundError = require('./utils/not-found');

app.set("view engine", "pug");

app.use('/static', express.static('public'));

app.use(express.urlencoded({ extended: true }));

// Views
app.get('/', (req, res, next) => {
    res.redirect('/books');
});

app.use("/books", booksRouter);

// Every other page
app.use((req, res, next) => {
    raiseNotFoundError(next);
});

// Error handling middleware
app.use((error, req, res, next) => {
    const context = { error };

    if(error.status === 404) {
        console.error(`The following page has not been found: ${req.url}.`);
        res.render("page-not-found", context);
    } else {
        res.render("error", context);
    }
});

app.listen(3000);
