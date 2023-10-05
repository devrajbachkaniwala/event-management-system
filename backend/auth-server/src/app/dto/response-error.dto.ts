import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';

type TResponseError = {
  statusCode: number;
  message: string;
  fields?: any;
};

class ResponseError {
  statusCode: number;
  message: string;
  fields?: any;
  constructor(err: TResponseError) {
    this.statusCode = err.statusCode;
    this.message = err.message;
    this.fields = err.fields;
  }
}

export class ResponseErrorDto {
  static create(data: any) {
    if (!data.statusCode) {
      data.statusCode = HttpStatus.BAD_REQUEST;
    }

    switch (data.statusCode) {
      case HttpStatus.UNAUTHORIZED:
        return new UnauthorizedException(new ResponseError(data));

      case HttpStatus.FORBIDDEN:
        return new ForbiddenException(new ResponseError(data));

      case HttpStatus.NOT_FOUND:
        return new NotFoundException(new ResponseError(data));

      default:
        data.statusCode = HttpStatus.BAD_REQUEST;
        return new BadRequestException(new ResponseError(data));
    }
  }
}
