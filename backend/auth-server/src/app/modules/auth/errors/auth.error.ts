export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class AuthErrorFactory {
  static create(err: any, message: string): AuthError {
    if (err instanceof AuthError) {
      return err;
    }
    return new AuthError(message);
  }
}
