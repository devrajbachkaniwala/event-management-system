import { AuthError } from './auth.error';

export class UserEmailAlreadyExists extends AuthError {
  constructor(message?: string, statusCode?: number) {
    super(message ?? 'User email already exists', statusCode);
  }
}
