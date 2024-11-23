class ErrorHandler extends Error {
	constructor(message, statusCode, res) {
		super(message);
		this.statusCode = statusCode;
	}
}

module.exports = ErrorHandler;
