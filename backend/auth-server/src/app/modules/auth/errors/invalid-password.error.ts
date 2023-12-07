import { AuthError } from './auth.error';

export class InvalidPassword extends AuthError {
  constructor(message?: string, statusCode?: number) {
    super(message ?? 'Invalid password', statusCode);
  }
}
