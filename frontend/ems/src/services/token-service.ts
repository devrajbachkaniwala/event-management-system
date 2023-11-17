import { LocalStorageService } from './local-storage-service';

export class TokenService {
  static getAccessToken() {
    return LocalStorageService.get('accessToken');
  }

  static setAccessToken(token: string) {
    return LocalStorageService.set('accessToken', token);
  }

  static removeAccessToken() {
    return LocalStorageService.remove('accessToken');
  }

  static getRefreshToken() {
    return LocalStorageService.get('refreshToken');
  }

  static setRefreshToken(token: string) {
    return LocalStorageService.set('refreshToken', token);
  }

  static removeRefreshToken() {
    return LocalStorageService.remove('refreshToken');
  }

  static removeAllTokens() {
    TokenService.removeAccessToken();
    TokenService.removeRefreshToken();
  }
}

export class TokenServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
