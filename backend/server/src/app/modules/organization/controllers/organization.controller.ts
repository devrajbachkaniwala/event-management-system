import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Inject,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  Res
} from '@nestjs/common';
import {
  CreateOrganizationDto,
  OrganizationDto,
  UpdateOrganizationDto
} from '../dto';
import { ResErrorDtoFactory, ResSuccessDtoFactory } from 'src/app/dto';
import { GetOrgId, GetUserId, Public, Roles } from 'src/app/decorators';
import { IOrganizationService, organizationServiceToken } from '../services';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/app/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { extname } from 'path';
import { Response } from 'express';
import { EventDto } from '../../events';

@Controller({ path: 'organization', version: '1' })
export class OrganizationController {
  constructor(
    @Inject(organizationServiceToken)
    private readonly organizationsService: IOrganizationService
  ) {}

  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/organization-photos',
        filename: (req, file, callback) => {
          const name = v4();
          const ext = extname(file.originalname);
          const filename = name + ext;

          callback(null, filename);
        }
      })
    })
  )
  @Post()
  @Roles([Role.USER])
  @UseGuards(RoleGuard)
  async create(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 80000,
            message: 'Photo cannot exceed 80kb'
          }),
          new FileTypeValidator({
            fileType: /.(jpg|jpeg|png)$/
          })
        ]
      })
    )
    file: Express.Multer.File,
    @GetUserId() userId: string,
    @Body() createOrganizationDto: CreateOrganizationDto
  ) {
    let organizationDto: OrganizationDto = null;
    try {
      organizationDto = await this.organizationsService.create(
        userId,
        createOrganizationDto,
        file
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to create an organization');
    }

    return ResSuccessDtoFactory.create(organizationDto);
  }

  @Get()
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async findOne(@GetUserId() userId: string, @GetOrgId() orgId: string) {
    let organizationDto: OrganizationDto = null;
    try {
      organizationDto = await this.organizationsService.findOne(userId, orgId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get an organization');
    }

    return ResSuccessDtoFactory.create(organizationDto);
  }

  @Get('/events')
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async getOrgEvents(@GetOrgId() orgId: string) {
    let events: EventDto[] = null;
    try {
      events = await this.organizationsService.getOrgEvents(orgId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(
        err,
        'Failed to get an organization events'
      );
    }

    return ResSuccessDtoFactory.create(events);
  }

  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/organization-photos',
        filename: (req, file, callback) => {
          const name = v4();
          const ext = extname(file.originalname);
          const filename = name + ext;

          callback(null, filename);
        }
      })
    })
  )
  @Patch()
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async update(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 80000,
            message: 'Photo cannot exceed 80kb'
          }),
          new FileTypeValidator({
            fileType: /.(jpg|jpeg|png)$/
          })
        ]
      })
    )
    file: Express.Multer.File,
    @GetUserId() userId: string,
    @GetOrgId() orgId: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ) {
    let organizationDto: OrganizationDto = null;
    try {
      organizationDto = await this.organizationsService.update(
        userId,
        orgId,
        updateOrganizationDto,
        file
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to update an organization');
    }

    return ResSuccessDtoFactory.create(organizationDto);
  }

  @Delete()
  @Roles([Role.ORGANIZATION_CREATOR])
  @UseGuards(RoleGuard)
  async remove(@GetUserId() userId: string, @GetOrgId() orgId: string) {
    let isRemoved: boolean = false;
    try {
      isRemoved = await this.organizationsService.remove(userId, orgId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to remove an organization');
    }

    return ResSuccessDtoFactory.create({
      message: 'Successfully removed an organization'
    });
  }

  @Get('photos/:filename')
  @Public()
  getOrgPhotoByFilename(
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    res.sendFile(filename, { root: './uploads/organization-photos' });
  }
}
