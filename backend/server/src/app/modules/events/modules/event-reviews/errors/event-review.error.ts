export class EventReviewError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class EventReviewErrorFactory {
  static create(err: any, message: string): EventReviewError {
    if (err instanceof EventReviewError) {
      return err;
    }
    return new EventReviewError(message);
  }
}
