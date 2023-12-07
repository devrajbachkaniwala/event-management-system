export class ResSuccessDto<T> {
  data: T;
}

export class ResSuccessDtoFactory {
  static create<T>(data: T): ResSuccessDto<T> {
    const resDto: ResSuccessDto<T> = new ResSuccessDto<T>();
    resDto.data = data;
    return resDto;
  }
}
