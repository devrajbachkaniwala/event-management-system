import { FetchService } from './fetch-service';
import { EnvService } from './env-service';
import { OrganizationDto } from '@/dto/organization.dto';
import { retryFunction } from '@/utils/retryFunction';
import { EventDto } from '@/dto/event.dto';

export class OrgService {
  static async get(): Promise<OrganizationDto> {
    const url = `${EnvService.getServerUrl()}/v1/organization`;
    const res = await FetchService.getWithNoStore(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new OrgServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.get();
      }
    }

    return resData.data as OrganizationDto;
  }

  static async getOrgEvents(): Promise<EventDto[]> {
    const url = `${EnvService.getServerUrl()}/v1/organization/events`;
    const res = await FetchService.getWithNoStore(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new OrgServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.getOrgEvents();
      }
    }

    return resData.data as EventDto[];
  }
}

export class OrgServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
