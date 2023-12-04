import { Role, User, UserToken } from '@prisma/client';
import { UpdateUserProfileDto } from '../../account';
import { RegisterUserDto } from '../../auth';

export type TCreateUser = RegisterUserDto & {
  role?: Role;
  photoUrl?: string;
};

export type TUpdateUser = UpdateUserProfileDto & {
  role?: Role;
  photoUrl?: string;
  isActive?: boolean;
};

export const userDaoToken = Symbol('userDaoToken');
export interface IUserDao {
  create(createUserDto: TCreateUser): Promise<User>;

  findAll(): Promise<User[]>;

  findById(userId: string): Promise<User>;

  findByEmail(email: string): Promise<User>;

  update(userId: string, updateUserDto: TUpdateUser): Promise<User>;

  remove(userId: string): Promise<boolean>;

  getUserByAccessJti(
    userId: string,
    accessJti: string
  ): Promise<User & { tokens: UserToken[] }>;

  getUserByRefreshJti(
    userId: string,
    refreshJti: string
  ): Promise<User & { tokens: UserToken[] }>;
}
