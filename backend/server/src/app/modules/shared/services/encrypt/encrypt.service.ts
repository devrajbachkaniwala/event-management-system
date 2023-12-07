import { Injectable } from '@nestjs/common';
import { IEncryptService } from './encrypt-service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService implements IEncryptService {
  hash(password: string, saltRounds: any): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  compare(password: string, hashedPassword: any): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
