import { FetchService } from './fetch-service';
import { EnvService } from './env-service';
import { OrganizationDto } from '@/dto/organization.dto';
import { retryFunction } from '@/utils/retryFunction';
import { EventDto } from '@/dto/event.dto';
import { CreateOrganizationDto } from '@/dto/create-organization.dto';
import { UpdateOrganizationDto } from '@/dto/update-organization.dto';
import { UserDto } from '@/dto/user.dto';

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

  static async create(
    orgDto: CreateOrganizationDto,
    photoFile: File
  ): Promise<OrganizationDto> {
    const formData = new FormData();

    for (const [key, value] of Object.entries(orgDto)) {
      formData.append(key, value);
    }
    formData.append('photo', photoFile, photoFile.name);

    const url = `${EnvService.getServerUrl()}/v1/organization`;
    const res = await FetchService.post(url, {
      authTokenType: 'accessToken',
      body: formData,
      contentType: 'form-data'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new OrgServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.create(orgDto, photoFile);
      }
    }

    return resData.data as OrganizationDto;
  }

  static async edit(
    orgDto: UpdateOrganizationDto,
    photoFile: File | undefined
  ): Promise<OrganizationDto> {
    const formData = new FormData();

    for (const [key, value] of Object.entries(orgDto)) {
      formData.append(key, value);
    }

    if (photoFile) {
      formData.append('photo', photoFile, photoFile.name);
    }

    const url = `${EnvService.getServerUrl()}/v1/organization`;
    const res = await FetchService.patch(url, {
      authTokenType: 'accessToken',
      body: formData,
      contentType: 'form-data'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new OrgServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.edit(orgDto, photoFile);
      }
    }

    return resData.data as OrganizationDto;
  }

  static async getTeamMembers(): Promise<UserDto[]> {
    const url = `${EnvService.getServerUrl()}/v1/organization/team-members`;
    const res = await FetchService.getWithNoStore(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new OrgServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.getTeamMembers();
      }
    }

    return resData.data as UserDto[];
  }

  static async addTeamMember(teamMemberEmail: string): Promise<UserDto> {
    const url = `${EnvService.getServerUrl()}/v1/organization/team-members`;
    const res = await FetchService.post(url, {
      authTokenType: 'accessToken',
      body: { email: teamMemberEmail },
      contentType: 'application/json'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new OrgServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.addTeamMember(teamMemberEmail);
      }
    }

    return resData.data as UserDto;
  }

  static async removeTeamMember(
    teamMemberId: string
  ): Promise<{ message: string }> {
    const url = `${EnvService.getServerUrl()}/v1/organization/team-members/${teamMemberId}`;
    const res = await FetchService.delete(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new OrgServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.removeTeamMember(teamMemberId);
      }
    }

    return resData.data as { message: string };
  }
}

export class OrgServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
