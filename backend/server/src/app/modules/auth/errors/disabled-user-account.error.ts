import { AuthError } from './auth.error';

export class DisabledUserAccount extends AuthError {
  constructor(message?: string, statusCode?: number) {
    super(message ?? 'User account is disabled', statusCode);
  }
}
