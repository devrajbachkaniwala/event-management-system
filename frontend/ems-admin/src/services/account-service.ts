import { UserDto } from '@/dto/user.dto';
import { EnvService } from './env-service';
import { FetchService } from './fetch-service';
import { UpdateUserProfileDto } from '@/dto/update-user-profile.dto';

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

  static async editUserProfile(
    userProfile: UpdateUserProfileDto,
    photoFile: File | undefined
  ) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(userProfile)) {
      formData.append(key, value);
    }

    if (photoFile) {
      formData.append('photo', photoFile, photoFile.name);
    }

    const url = `${EnvService.getServerUrl()}/v1/account/user-profile`;
    const res = await FetchService.patch(url, {
      authTokenType: 'accessToken',
      body: formData,
      contentType: 'form-data'
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
