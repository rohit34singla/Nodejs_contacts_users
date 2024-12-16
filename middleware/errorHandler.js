const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    let response = {
        title: "Error",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "development" ? err.stack : undefined,
    };

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            response.title = "Validation Failed";
            break;
        case constants.UNAUTHORIZED:
            response.title = "Unauthorized";
            break;
        case constants.FORBIDDEN:
            response.title = "Forbidden";
            break;
        case constants.NOT_FOUND:
            response.title = "Not Found";
            break;
        case constants.SERVER_ERROR:
            response.title = "Server Error";
            break;
        default:
            console.log("Unhandled error type");
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
