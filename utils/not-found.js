const raiseNotFoundError = (nextFunc) => {
    // Creates an error with status 404 if the page wasn't found
    const error = new Error("Sorry! We couldn't find the page you were looking for.");
    error.status = 404;
    nextFunc(error);
}

module.exports = raiseNotFoundError;
