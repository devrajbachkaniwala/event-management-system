export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }

  static create(err: any, message: string) {
    if (err instanceof AuthError) {
      return err;
    }
    return new AuthError(message);
  }
}
