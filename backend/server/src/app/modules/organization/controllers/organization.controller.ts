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
import { ResErrorDtoFactory, ResSuccessDtoFactory, UserDto } from 'src/app/dto';
import { GetReqUser, Public, Roles } from 'src/app/decorators';
import { IOrganizationService, organizationServiceToken } from '../services';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/app/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { extname } from 'path';
import { Response } from 'express';

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
  @Post('create')
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
    @GetReqUser() reqUser: { user: UserDto; jti: string },
    @Body() createOrganizationDto: CreateOrganizationDto
  ) {
    let organizationDto: OrganizationDto = null;
    try {
      organizationDto = await this.organizationsService.create(
        reqUser.user.id,
        createOrganizationDto,
        file
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to create an organization');
    }

    return ResSuccessDtoFactory.create(organizationDto);
  }

  @Get()
  async findOne(@GetReqUser() reqUser: { user: UserDto; jti: string }) {
    let organizationDto: OrganizationDto = null;
    try {
      organizationDto = await this.organizationsService.findOne(
        reqUser.user.id
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get an organization');
    }

    return ResSuccessDtoFactory.create(organizationDto);
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
  @Patch('update')
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
    @GetReqUser() reqUser: { user: UserDto; jti: string },
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ) {
    let organizationDto: OrganizationDto = null;
    try {
      organizationDto = await this.organizationsService.update(
        reqUser.user.id,
        updateOrganizationDto,
        file
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to update an organization');
    }

    return ResSuccessDtoFactory.create(organizationDto);
  }

  @Delete('delete')
  @Roles([Role.ORGANIZATION_CREATOR])
  @UseGuards(RoleGuard)
  async remove(@GetReqUser() reqUser: { user: UserDto; jti: string }) {
    let isRemoved: boolean = false;
    try {
      isRemoved = await this.organizationsService.remove(reqUser.user.id);
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
