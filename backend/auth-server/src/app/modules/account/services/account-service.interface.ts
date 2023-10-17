import { UserDto } from 'src/app/dto';
import { UpdateUserProfileDto } from '../dto';

export const accountServiceToken = Symbol('accountServiceToken');
export interface IAccountService {
  updateUserProfile(
    userId: string,
    updateUserProfile: UpdateUserProfileDto
  ): Promise<UserDto>;
}
