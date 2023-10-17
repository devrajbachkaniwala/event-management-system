import { Global, Module, Provider } from '@nestjs/common';
import { PrismaService, prismaServiceToken } from './services';

const prismaServiceProvider: Provider = {
  provide: prismaServiceToken,
  useClass: PrismaService
};

@Global()
@Module({
  providers: [prismaServiceProvider],
  exports: [prismaServiceProvider]
})
export class PrismaModule {}
