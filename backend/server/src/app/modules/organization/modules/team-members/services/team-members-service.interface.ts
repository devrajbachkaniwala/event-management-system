import { UserDto } from 'src/app/dto';

export const teamMembersServiceToken = Symbol('teamMembersServiceToken');
export interface ITeamMembersService {
  addTeamMember(orgId: string, teamMemberEmail: string): Promise<UserDto>;
  removeTeamMember(userDto: UserDto, teamMemberId: string): Promise<true>;
  findAllTeamMembers(orgId: string): Promise<UserDto[]>;
}
