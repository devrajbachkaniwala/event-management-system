import { EnvService } from './env-service';
import { FetchService } from './fetch-service';

export class AuthService {
  static async login(userCredentials: TLoginCredentials): Promise<TTokens> {
    const url = `${EnvService.getServerUrl()}/v1/auth/login`;
    const res = await FetchService.post(url, {
      body: userCredentials,
      contentType: 'application/json'
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new AuthServiceError(resData.message);
    }

    return resData.data as TTokens;
  }

  static async getAccessToken() {
    const url = `${EnvService.getServerUrl()}/v1/auth/token`;
    const res = await FetchService.post(url, {
      authTokenType: 'refreshToken'
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new AuthServiceError(resData.message);
    }

    return resData.data as TToken;
  }

  static async logout(): Promise<{ message: string }> {
    const url = `${EnvService.getServerUrl()}/v1/auth/logout`;
    const res = await FetchService.post(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new AuthServiceError(resData.message);
    }

    return resData.data as { message: string };
  }
}

export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
