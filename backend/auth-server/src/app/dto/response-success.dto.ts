export class ResponseSuccessDto<T> {
  constructor(public data: T) {}

  static create<T>(data: T) {
    return new ResponseSuccessDto(data);
  }
}
