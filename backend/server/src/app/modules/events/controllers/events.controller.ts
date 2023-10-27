import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common';
import { IEventsService, eventsServiceToken } from '../services';
import { CreateEventDto, EventDto, UpdateEventDto } from '../dto';
import { ResErrorDtoFactory, ResSuccessDtoFactory } from 'src/app/dto';
import { GetOrgId, Public, Roles } from 'src/app/decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/app/guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { extname } from 'path';

@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(
    @Inject(eventsServiceToken) private readonly eventsService: IEventsService
  ) {}

  @Post()
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  @UseInterceptors(
    FilesInterceptor('photos', 5, {
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
    @Body() createEventDto: CreateEventDto,
    @UploadedFiles(
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
    files: Array<Express.Multer.File>
  ) {
    let eventDto: EventDto = null;
    try {
      eventDto = await this.eventsService.create(orgId, createEventDto, files);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to create an event');
    }

    return ResSuccessDtoFactory.create(eventDto);
  }

  @Get()
  @Public()
  async findAll() {
    let events: EventDto[] = null;
    try {
      events = await this.eventsService.findAll();
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get all events');
    }

    return ResSuccessDtoFactory.create(events);
  }

  @Get(':event_id')
  @Public()
  async findOne(@Param('event_id') eventId: string) {
    let event: EventDto = null;
    try {
      event = await this.eventsService.findOne(eventId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get an event');
    }

    return ResSuccessDtoFactory.create(event);
  }

  @Patch(':event_id')
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async update(
    @GetOrgId() orgId: string,
    @Param('event_id') eventId: string,
    @Body() updateEventDto: UpdateEventDto
  ) {
    let event: EventDto = null;
    try {
      event = await this.eventsService.update(orgId, eventId, updateEventDto);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to update an event');
    }

    return ResSuccessDtoFactory.create(event);
  }

  @Delete(':event_id')
  @Roles([Role.TEAM_MEMBER])
  @UseGuards(RoleGuard)
  async remove(@GetOrgId() orgId: string, @Param('event_id') eventId: string) {
    let isDeleted: boolean = false;
    try {
      isDeleted = await this.eventsService.remove(orgId, eventId);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to delete an event');
    }

    return ResSuccessDtoFactory.create({
      message: 'Successfully deleted an event'
    });
  }
}
