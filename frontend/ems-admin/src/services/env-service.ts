export class EnvService {
  static getServerUrl() {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }
}
