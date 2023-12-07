export class EventTimingError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class EventTimingErrorFactory {
  static create(err: any, message: string): EventTimingError {
    if (err instanceof EventTimingError) {
      return err;
    }
    return new EventTimingError(message);
  }
}
