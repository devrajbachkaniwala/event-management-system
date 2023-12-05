export class LocalStorageService {
  static get(key: string) {
    return localStorage.getItem(key);
  }

  static set(key: string, value: string) {
    return localStorage.setItem(key, value);
  }

  static remove(key: string) {
    return localStorage.removeItem(key);
  }

  static clear() {
    return localStorage.clear();
  }
}
