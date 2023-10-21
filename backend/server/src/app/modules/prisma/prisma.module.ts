import { Global, Module, Provider } from '@nestjs/common';
import { PrismaApiService, prismaApiServiceToken } from './services';

const prismaApiServiceProvider: Provider = {
  provide: prismaApiServiceToken,
  useClass: PrismaApiService
};

@Global()
@Module({
  providers: [prismaApiServiceProvider],
  exports: [prismaApiServiceProvider]
})
export class PrismaModule {}
