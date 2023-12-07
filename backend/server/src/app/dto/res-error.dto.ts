import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';

class ResErrorDto {
  statusCode: number;
  message: string;
  fields?: any;
}

export class ResErrorDtoFactory {
  static create(data: any, message?: string): HttpException {
    if (!data.statusCode) {
      data.statusCode = HttpStatus.BAD_REQUEST;
      data.message = message ?? data.message;
    }

    const errResDto = new ResErrorDto();
    errResDto.statusCode = data.statusCode;
    errResDto.message = data.message;
    errResDto.fields = data.fields;

    switch (data.statusCode) {
      case HttpStatus.UNAUTHORIZED:
        return new UnauthorizedException(errResDto);

      case HttpStatus.FORBIDDEN:
        return new ForbiddenException(errResDto);

      case HttpStatus.NOT_FOUND:
        return new NotFoundException(errResDto);

      default:
        data.statusCode = HttpStatus.BAD_REQUEST;
        return new BadRequestException(errResDto);
    }
  }
}
