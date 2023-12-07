import { UsersService } from '@/services/users-service';

export const getAllUsers = async () => {
  try {
    const users = await UsersService.getAll();

    return users;
  } catch (err: any) {
    console.log(err);
  }
};
