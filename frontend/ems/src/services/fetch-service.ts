import { refetchAccessToken } from '@/utils/refetchAccessToken';
import { LocalStorageService } from './local-storage-service';
import { TokenService } from './token-service';
import { enhancedRevalidateFetch } from '@/utils/enhancedRevalidateFetch';

type TContentType = 'application/json' | 'form-data';

type TOpt = {
  headers?: Record<string, string> & {
    authorization?: string;
    'Content-Type'?: TContentType;
  };
  authTokenType?: 'accessToken' | 'refreshToken';
};

type TGetOpt = TOpt;

type TBody = {
  body?: any;
  contentType?: TContentType;
};

type TPostOpt = TOpt & TBody;

type TPatchOpt = TOpt & TBody;

type TDeleteOpt = TOpt & TBody;

export class FetchService {
  static getWithForceCache(url: string, options?: TGetOpt) {
    const auth = FetchService.addAuthHeader(options?.authTokenType);

    return enhancedRevalidateFetch(url, {
      headers: {
        ...options?.headers,
        ...auth
      }
    });

    // return fetch(url, {
    //   headers: {
    //     ...options?.headers,
    //     ...auth
    //   }
    // });
  }

  static getWithNoStore(url: string, options?: TGetOpt) {
    const auth = FetchService.addAuthHeader(options?.authTokenType);

    return enhancedRevalidateFetch(url, {
      headers: {
        ...options?.headers,
        ...auth
      },
      cache: 'no-store'
    });

    // return fetch(url, {
    //   headers: {
    //     ...options?.headers,
    //     ...auth
    //   },
    //   cache: 'no-store'
    // });
  }

  static getWithRevalidate(
    url: string,
    options?: TGetOpt & { revalidate: number }
  ) {
    const auth = FetchService.addAuthHeader(options?.authTokenType);

    return enhancedRevalidateFetch(url, {
      headers: {
        ...options?.headers,
        ...auth
      },
      next: {
        revalidate: options?.revalidate
      }
    });

    // return fetch(url, {
    //   headers: {
    //     ...options?.headers,
    //     ...auth
    //   },
    //   next: {
    //     revalidate: options?.revalidate
    //   }
    // });
  }

  static post(url: string, options: TPostOpt) {
    const auth = FetchService.addAuthHeader(options?.authTokenType);

    const headerOpt = {
      ...options.headers,
      ...auth
    };

    if (options.contentType === 'application/json') {
      headerOpt['Content-Type'] = options.contentType;
    }

    let bodyData = options.body;

    if (options.contentType === 'application/json') {
      bodyData = JSON.stringify(bodyData);
    }

    return enhancedRevalidateFetch(url, {
      method: 'POST',
      headers: headerOpt,
      body: bodyData
    });

    // return fetch(url, {
    //   method: 'POST',
    //   headers: headerOpt,
    //   body: bodyData
    // });
  }

  static patch(url: string, options: TPatchOpt) {
    const auth = FetchService.addAuthHeader(options?.authTokenType);

    const headerOpt = {
      ...options.headers,
      ...auth
    };

    if (options.contentType === 'application/json') {
      headerOpt['Content-Type'] = options.contentType;
    }

    let bodyData = options.body;

    if (options.contentType === 'application/json') {
      bodyData = JSON.stringify(bodyData);
    }

    return enhancedRevalidateFetch(url, {
      method: 'PATCH',
      headers: headerOpt,
      body: bodyData
    });

    // return fetch(url, {
    //   method: 'PATCH',
    //   headers: headerOpt,
    //   body: bodyData
    // });
  }

  static delete(url: string, options: TDeleteOpt) {
    const auth = FetchService.addAuthHeader(options?.authTokenType);

    const headerOpt = {
      ...options.headers,
      ...auth
    };

    if (options.contentType === 'application/json') {
      headerOpt['Content-Type'] = options.contentType;
    }

    let bodyData = options.body;

    if (options.contentType === 'application/json') {
      bodyData = JSON.stringify(bodyData);
    }

    return enhancedRevalidateFetch(url, {
      method: 'DELETE',
      headers: headerOpt,
      body: bodyData
    });

    // return fetch(url, {
    //   method: 'DELETE',
    //   headers: headerOpt,
    //   body: bodyData
    // });
  }

  static addAuthHeader(tokenType: 'accessToken' | 'refreshToken' | undefined) {
    const header = {
      authorization: 'Bearer '
    };

    if (tokenType === 'accessToken') {
      header.authorization += TokenService.getAccessToken();
    } else if (tokenType === 'refreshToken') {
      header.authorization += TokenService.getRefreshToken();
    } else {
      return {};
    }
    return header;
  }
}
