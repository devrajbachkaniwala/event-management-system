import { AuthError } from './auth.error';

export class InvalidToken extends AuthError {
  constructor(message?: string, statusCode?: number) {
    super(message ?? 'Invalid token', statusCode);
  }
}
