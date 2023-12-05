import { AuthService } from '@/services/auth-service';
import { TokenService } from '@/services/token-service';

export const login = async (loginCredentials: TLoginCredentials) => {
  try {
    const res = await AuthService.login(loginCredentials);

    TokenService.setAccessToken(res.accessToken);
    TokenService.setRefreshToken(res.refreshToken);

    return res;
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};
