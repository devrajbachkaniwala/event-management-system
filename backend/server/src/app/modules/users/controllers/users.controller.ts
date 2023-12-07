import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Inject,
  Query,
  ParseArrayPipe,
  UseGuards
} from '@nestjs/common';
import { IUsersService, usersServiceToken } from '../services';
import { ModerateUserDto } from '../dto';
import { ResErrorDtoFactory, ResSuccessDtoFactory, UserDto } from 'src/app/dto';
import { Roles } from 'src/app/decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/app/guards';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    @Inject(usersServiceToken) private readonly usersService: IUsersService
  ) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  @Roles([Role.ADMIN])
  @UseGuards(RoleGuard)
  async findAll() {
    let users: UserDto[] = null;
    try {
      users = await this.usersService.findAll();
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get all users');
    }

    return ResSuccessDtoFactory.create(users);
  }

  @Get(':user_id')
  @Roles([Role.ADMIN])
  @UseGuards(RoleGuard)
  async findOne(
    @Param('user_id') userId: string,
    @Query(
      'includes',
      new ParseArrayPipe({
        optional: true,
        items: String,
        separator: ','
      })
    )
    includes: string[],
    @Query(
      'booking-includes',
      new ParseArrayPipe({
        optional: true,
        items: String,
        separator: ','
      })
    )
    bookingIncludes: string[]
  ) {
    let user: UserDto = null;
    try {
      user = await this.usersService.findOne(userId, includes, bookingIncludes);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to get a user');
    }

    return ResSuccessDtoFactory.create(user);
  }

  @Patch(':user_id/moderate')
  @Roles([Role.ADMIN])
  @UseGuards(RoleGuard)
  async moderateUser(
    @Param('user_id') userId: string,
    @Body() moderateUserDto: ModerateUserDto
  ) {
    let user: UserDto = null;
    try {
      user = await this.usersService.moderateUser(userId, moderateUserDto);
    } catch (err: any) {
      throw ResErrorDtoFactory.create(err, 'Failed to moderate a user');
    }

    return ResSuccessDtoFactory.create(user);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
