import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards
} from '@nestjs/common';
import {
  CreateOrganizationDto,
  OrganizationDto,
  UpdateOrganizationDto
} from '../dto';
import { ResErrorDtoFactory, ResSuccessDtoFactory, UserDto } from 'src/app/dto';
import { GetReqUser, Roles } from 'src/app/decorators';
import { IOrganizationsService, organizationsServiceToken } from '../services';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/app/guards';

@Controller({ path: 'organizations', version: '1' })
export class OrganizationsController {
  constructor(
    @Inject(organizationsServiceToken)
    private readonly organizationsService: IOrganizationsService
  ) {}

  @Post('create')
  @Roles([Role.USER])
  @UseGuards(RoleGuard)
  async create(
    @GetReqUser() reqUser: { user: UserDto; jti: string },
    @Body() createOrganizationDto: CreateOrganizationDto
  ) {
    let organizationDto: OrganizationDto = null;
    try {
      organizationDto = await this.organizationsService.create(
        reqUser.user.id,
        createOrganizationDto
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to create an organization');
    }

    return ResSuccessDtoFactory.create(organizationDto);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':organizationId')
  async findOne(@Param('organizationId') orgId: string) {
    let organizationDto: OrganizationDto = null;
    try {
      organizationDto = await this.organizationsService.findOne(orgId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get an organization');
    }

    return ResSuccessDtoFactory.create(organizationDto);
  }

  @Patch(':organizationId/update')
  async update(
    @Param('organizationId') orgId: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ) {
    let organizationDto: OrganizationDto = null;
    try {
      organizationDto = await this.organizationsService.update(
        orgId,
        updateOrganizationDto
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to update an organization');
    }

    return ResSuccessDtoFactory.create(organizationDto);
  }

  @Delete(':organizationId/delete')
  async remove(
    @Param('organizationId') orgId: string,
    @GetReqUser() reqUser: { user: UserDto; jti: string }
  ) {
    let isRemoved: boolean = false;
    try {
      isRemoved = await this.organizationsService.remove(
        reqUser.user.id,
        orgId
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to remove an organization');
    }

    return ResSuccessDtoFactory.create({
      message: 'Successfully removed an organization'
    });
  }
}
