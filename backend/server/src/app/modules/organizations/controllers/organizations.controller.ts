import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject
} from '@nestjs/common';
import {
  IOrganizationsService,
  organizationsServiceToken
} from '../services/organizations-service.interface';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dto';

@Controller({ path: 'organizations', version: '1' })
export class OrganizationsController {
  constructor(
    @Inject(organizationsServiceToken)
    private readonly organizationsService: IOrganizationsService
  ) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(+id);
  }
}
