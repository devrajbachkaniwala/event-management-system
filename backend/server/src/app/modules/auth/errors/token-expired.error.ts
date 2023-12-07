import { AuthError } from './auth.error';

export class TokenExpired extends AuthError {
  constructor(message?: string, statusCode?: number) {
    super(message ?? 'Token expired', statusCode);
  }
}
