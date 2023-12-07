export class AccountError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class AccountErrorFactory {
  static create(err: any, message: string): AccountError {
    if (err instanceof AccountError) {
      return err;
    }
    return new AccountError(message);
  }
}
