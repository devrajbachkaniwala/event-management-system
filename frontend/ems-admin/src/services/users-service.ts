import { retryFunction } from '@/utils/retryFunction';
import { EnvService } from './env-service';
import { FetchService } from './fetch-service';
import { UserDto } from '@/dto/user.dto';
import { ModerateUserDto } from '@/dto/moderate-user.dto';

export class UsersService {
  static async getAll(): Promise<UserDto[]> {
    const url = `${EnvService.getServerUrl()}/v1/users`;
    const res = await FetchService.getWithNoStore(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new UsersServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.getAll();
      }
    }

    return resData.data as UserDto[];
  }

  static async get(userId: string): Promise<UserDto> {
    const _url = `${EnvService.getServerUrl()}/v1/users/${userId}`;
    const url = new URL(_url);
    url.searchParams.set('includes', 'bookings');
    url.searchParams.set('booking-includes', 'event,organization,price,timing');

    const res = await FetchService.getWithNoStore(url.toString(), {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new UsersServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.get(userId);
      }
    }

    return resData.data as UserDto;
  }

  static async moderate(
    userId: string,
    moderateUserDto: ModerateUserDto
  ): Promise<UserDto> {
    const url = `${EnvService.getServerUrl()}/v1/users/${userId}/moderate`;
    const res = await FetchService.patch(url, {
      authTokenType: 'accessToken',
      body: moderateUserDto,
      contentType: 'application/json'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new UsersServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.moderate(userId, moderateUserDto);
      }
    }

    return resData.data as UserDto;
  }

  static async delete(userId: string): Promise<{ message: string }> {
    const url = `${EnvService.getServerUrl()}/v1/users/${userId}`;
    const res = await FetchService.delete(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new UsersServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.delete(userId);
      }
    }

    return resData.data as { message: string };
  }
}

export class UsersServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
