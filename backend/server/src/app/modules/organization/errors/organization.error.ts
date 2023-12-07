export class OrganizationError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

export class OrganizationErrorFactory {
  static create(err: any, message: string): OrganizationError {
    if (err instanceof OrganizationError) {
      return err;
    }
    return new OrganizationError(message);
  }
}
