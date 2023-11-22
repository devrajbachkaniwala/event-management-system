import { getProfile } from './getProfile';

export const getUserSession = async () => {
  try {
    const user = await getProfile();

    return user;
  } catch (err: any) {
    console.log(err);
  }
};
