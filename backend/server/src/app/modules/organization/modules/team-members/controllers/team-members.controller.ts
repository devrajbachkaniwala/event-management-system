import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetReqUser, Roles } from 'src/app/decorators';
import { RoleGuard } from 'src/app/guards';
import { AddTeamMemberDto } from '../dto';
import { ResErrorDtoFactory, ResSuccessDtoFactory, UserDto } from 'src/app/dto';
import { ITeamMembersService, teamMembersServiceToken } from '../services';

@Controller({ path: 'team-members', version: '1' })
@UseGuards(RoleGuard)
export class TeamMembersController {
  constructor(
    @Inject(teamMembersServiceToken)
    private readonly teamMembersService: ITeamMembersService
  ) {}

  @Post()
  @Roles([Role.TEAM_MEMBER])
  async addTeamMember(
    @Body() addTeamMemberDto: AddTeamMemberDto,
    @GetReqUser() reqUser: { user: UserDto; jti: string }
  ) {
    let userDto: UserDto = null;
    try {
      userDto = await this.teamMembersService.addTeamMember(
        reqUser.user.orgId,
        addTeamMemberDto.email
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to add team member');
    }

    return ResSuccessDtoFactory.create(userDto);
  }

  @Delete(':team_member_id')
  @Roles([Role.TEAM_MEMBER])
  async removeTeamMember(
    @Param('team_member_id') teamMemberId: string,
    @GetReqUser() reqUser: { user: UserDto; jti: string }
  ) {
    let isRemoved = false;
    try {
      isRemoved = await this.teamMembersService.removeTeamMember(
        reqUser.user,
        teamMemberId
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to remove team member');
    }

    return ResSuccessDtoFactory.create({
      message: 'Successfully removed team member'
    });
  }

  @Get()
  @Roles([Role.TEAM_MEMBER])
  async findAllTeamMembers(
    @GetReqUser() reqUser: { user: UserDto; jti: string }
  ) {
    let users: UserDto[] = null;
    try {
      users = await this.teamMembersService.findAllTeamMembers(
        reqUser.user.orgId
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get all team members');
    }

    return ResSuccessDtoFactory.create(users);
  }
}
