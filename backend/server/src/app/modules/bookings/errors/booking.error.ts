export class BookingError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class BookingErrorFactory {
  static create(err: any, message: string): BookingError {
    if (err instanceof BookingError) {
      return err;
    }
    return new BookingError(message);
  }
}
