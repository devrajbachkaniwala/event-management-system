import { Module, Provider } from '@nestjs/common';
import { OrganizationsController } from './controllers';
import { OrganizationsService, organizationsServiceToken } from './services';

const organizationsServiceProvider: Provider = {
  provide: organizationsServiceToken,
  useClass: OrganizationsService
};

@Module({
  controllers: [OrganizationsController],
  providers: [organizationsServiceProvider]
})
export class OrganizationsModule {}
