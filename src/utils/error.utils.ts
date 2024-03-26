export class CustomError extends Error {
  public statusCode: number
  constructor(message: string) {
    super(message);
    this.statusCode = 500
  }
}

export class BadRequestError extends CustomError {
  public statusCode: number
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class NotFoundError extends CustomError {
  public statusCode: number
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export class UnauthenticatedError extends CustomError {
  public statusCode: number
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export class UnauthorizedError extends CustomError {
  public statusCode: number
  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}

export class ServerError extends CustomError {
  public statusCode: number
  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
}