import { UserDto } from 'src/app/dto';
import { ModerateUserDto } from '../dto';

export const usersServiceToken = Symbol('usersServiceToken');
export interface IUsersService {
  // create(createUserDto: CreateUserDto): unknown;

  findAll(): Promise<UserDto[]>;

  findOne(
    userId: string,
    includes: string[],
    bookingIncludes: string[]
  ): Promise<UserDto>;

  moderateUser(
    userId: string,
    moderateUserDto: ModerateUserDto
  ): Promise<UserDto>;

  // update(arg0: number, updateUserDto: UpdateUserDto): unknown;

  // remove(arg0: number): unknown;
}
