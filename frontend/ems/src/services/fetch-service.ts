type THeader = {
  headers?: Record<string, string>;
};

type TGetOpt = THeader;

type TBody = {
  body: any;
  contentType?: string;
};

type TPostOpt = THeader & TBody;

type TPatchOpt = THeader & TBody;

type TDeleteOpt = THeader & TBody;

export class FetchService {
  static getWithForceCache(url: string, options?: TGetOpt) {
    return fetch(url, {
      headers: options?.headers
    });
  }

  static getWithNoStore(url: string, options?: TGetOpt) {
    return fetch(url, {
      headers: options?.headers,
      cache: 'no-store'
    });
  }

  static getWithRevalidate(
    url: string,
    options?: TGetOpt & { revalidate: number }
  ) {
    return fetch(url, {
      headers: options?.headers,
      next: {
        revalidate: options?.revalidate
      }
    });
  }

  static post(url: string, options: TPostOpt) {
    const headerOpt = {
      ...options.headers
    };

    if (options.contentType) {
      headerOpt['Content-Type'] = options.contentType;
    }

    return fetch(url, {
      method: 'POST',
      headers: headerOpt,
      body: options.contentType?.includes('json')
        ? JSON.stringify(options.body)
        : options.body
    });
  }

  static patch(url: string, options: TPatchOpt) {
    const headerOpt = {
      ...options.headers
    };

    if (options.contentType) {
      headerOpt['Content-Type'] = options.contentType;
    }

    return fetch(url, {
      method: 'PATCH',
      headers: headerOpt,
      body: options.contentType?.includes('json')
        ? JSON.stringify(options.body)
        : options.body
    });
  }

  static delete(url: string, options: TDeleteOpt) {
    const headerOpt = {
      ...options.headers
    };

    if (options.contentType) {
      headerOpt['Content-Type'] = options.contentType;
    }

    return fetch(url, {
      method: 'DELETE',
      headers: headerOpt,
      body: options.contentType?.includes('json')
        ? JSON.stringify(options.body)
        : options.body
    });
  }
}
