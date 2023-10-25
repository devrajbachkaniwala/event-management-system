export class EventPhotoError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class EventPhotoErrorFactory {
  static create(err: any, message: string): EventPhotoError {
    if (err instanceof EventPhotoError) {
      return err;
    }
    return new EventPhotoError(message);
  }
}
