import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Inject,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Res,
  UseGuards
} from '@nestjs/common';
import { IEventPhotosService, eventPhotosServiceToken } from '../services';
import { EventPhotoDto } from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { extname } from 'path';
import { ResErrorDtoFactory, ResSuccessDtoFactory } from 'src/app/dto';
import { GetOrgId, Public, Roles } from 'src/app/decorators';
import { Response } from 'express';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/app/guards';

@Controller({ path: 'photos', version: '1' })
export class EventPhotosController {
  constructor(
    @Inject(eventPhotosServiceToken)
    private readonly eventPhotosService: IEventPhotosService
  ) {}

  @Post()
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/event-photos',
        filename: (req, file, callback) => {
          const name = v4();
          const ext = extname(file.originalname);
          const filename = name + ext;

          callback(null, filename);
        }
      })
    })
  )
  async create(
    @GetOrgId() orgId: string,
    @Param('event_id') eventId: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
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
    file: Express.Multer.File
  ) {
    let eventPhotoDto: EventPhotoDto = null;
    try {
      eventPhotoDto = await this.eventPhotosService.create(
        orgId,
        eventId,
        file
      );
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to create an event photo');
    }

    return ResSuccessDtoFactory.create(eventPhotoDto);
  }

  @Get()
  @Public()
  async findAll(@Param('event_id') eventId: string) {
    let photos: EventPhotoDto[] = null;
    try {
      photos = await this.eventPhotosService.findAll(eventId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get all event photos');
    }

    return ResSuccessDtoFactory.create(photos);
  }

  @Get(':filename')
  @Public()
  getEventPhotoByFilename(
    @Param('filename') filename: string,
    @Res() res: Response
  ) {
    res.sendFile(filename, { root: './uploads/event-photos' });
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateEventPhotoDto: UpdateEventPhotoDto
  // ) {
  //   return this.eventPhotosService.update(+id, updateEventPhotoDto);
  // }

  @Delete(':photo_id')
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async remove(
    @GetOrgId() orgId: string,
    @Param('event_id') eventId: string,
    @Param('photo_id') photoId: string
  ) {
    let isDeleted: boolean = false;
    try {
      isDeleted = await this.eventPhotosService.remove(orgId, eventId, photoId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to delete an event photo');
    }

    return ResSuccessDtoFactory.create({
      message: 'Successfully deleted an event photo'
    });
  }
}
