import { RegisterUserDto } from '@/dto/register-user.dto';
import { EnvService } from './env-service';
import { FetchService } from './fetch-service';
import { UserDto } from '@/dto/user.dto';

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

  static async register(
    registerUser: RegisterUserDto,
    photoFile?: File
  ): Promise<UserDto> {
    const formData = new FormData();

    for (const [key, value] of Object.entries(registerUser)) {
      console.log(key, value);
      formData.set(key, value as string);
    }

    if (photoFile) {
      formData.append('photo', photoFile);
    }

    const url = `${EnvService.getServerUrl()}/v1/auth/register`;
    const res = await FetchService.post(url, {
      body: formData
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new AuthServiceError(resData.message);
    }

    return resData.data as UserDto;
  }

  // static validateAccessToken(accessToken: string) {}
}

export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
