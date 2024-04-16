class APIError {
  constructor(statusCode, error) {
    this.statusCode = statusCode;
    this.error = error;
  }

  static badRequest(error) {
    return new APIError(400, error);
  }

  static unauthorized(error) {
    return new APIError(401, error);
  }

  static notFound(error) {
    return new APIError(404, error);
  }

  static requestTimeout(error) {
    return new APIError(408, error);
  }

  static unsupportedMediaType(error) {
    return new APIError(415, error);
  }

  static internalServerError(error) {
    return new APIError(500, error);
  }
}

module.exports = APIError;
