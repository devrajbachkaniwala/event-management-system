import { AuthError } from './auth.error';

export class UserNotFound extends AuthError {
  constructor(message?: string, statusCode?: number) {
    super(message ?? 'User not found', statusCode);
  }
}
