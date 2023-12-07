import { Global, Module, Provider } from '@nestjs/common';
import {
  EncryptService,
  UuidService,
  encryptServiceToken,
  uuidServiceToken
} from './services';

const uuidServiceProvider: Provider = {
  provide: uuidServiceToken,
  useClass: UuidService
};
const encryptServiceProvider: Provider = {
  provide: encryptServiceToken,
  useClass: EncryptService
};

@Global()
@Module({
  providers: [uuidServiceProvider, encryptServiceProvider],
  exports: [uuidServiceProvider, encryptServiceProvider]
})
export class SharedModule {}
