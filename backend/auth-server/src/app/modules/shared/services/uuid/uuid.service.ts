import { Injectable } from '@nestjs/common';
import { IUuidService } from './uuid-service.interface';
import { v4 } from 'uuid';

@Injectable()
export class UuidService implements IUuidService {
  generate(): string {
    return v4();
  }
}
