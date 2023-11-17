import { UserDto } from '@/dto/user.dto';
import { EnvService } from './env-service';
import { FetchService } from './fetch-service';

export class AccountService {
  static async getUserProfile() {
    const url = `${EnvService.getServerUrl()}/v1/account/user-profile`;
    const res = await FetchService.getWithNoStore(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new AccountServiceError(resData.message);
    }

    return resData.data as UserDto;
  }
}

export class AccountServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
