export class UserError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class UserErrorFactory {
  static create(err: any, message: string): UserError {
    if (err instanceof UserError) {
      return err;
    }
    return new UserError(message);
  }
}
