import { AuthService } from '@/services/auth-service';
import { LocalStorageService } from '@/services/local-storage-service';
import { TokenService } from '@/services/token-service';

export const refetchAccessToken = async () => {
  try {
    if (!TokenService.getRefreshToken()) {
      return;
    }

    const token = await AuthService.getAccessToken();

    if (token) {
      TokenService.setAccessToken(token.accessToken);
    } else {
      TokenService.removeAllTokens();
    }

    return token;
  } catch (err: any) {
    TokenService.removeAllTokens();
    console.log(err);
    // throw new Error(err.message);
  }
};
