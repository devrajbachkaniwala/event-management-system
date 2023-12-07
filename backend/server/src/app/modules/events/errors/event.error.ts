export class EventError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class EventErrorFactory {
  static create(err: any, message: string): EventError {
    if (err instanceof EventError) {
      return err;
    }
    return new EventError(message);
  }
}
