import { refetchAccessToken } from './refetchAccessToken';

export const retryFunction = async (res: Response): Promise<boolean> => {
  try {
    if (res.status === 401) {
      const token = await refetchAccessToken();

      return !!token;
    }
  } catch (err: any) {
    console.log(`retryFunction: ${err.message}`);
  }

  return false;
};
