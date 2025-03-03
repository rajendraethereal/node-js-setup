class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Capture stack trace (only for development)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;