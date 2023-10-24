export class EventPriceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class EventPriceErrorFactory {
  static create(err: any, message: string): EventPriceError {
    if (err instanceof EventPriceError) {
      return err;
    }
    return new EventPriceError(message);
  }
}
