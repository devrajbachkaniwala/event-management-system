import { Module, Provider } from '@nestjs/common';
import { OrganizationController } from './controllers';
import { OrganizationService, organizationServiceToken } from './services';
import { TeamMembersModule } from './modules';
import { RouterModule } from '@nestjs/core';

const organizationServiceProvider: Provider = {
  provide: organizationServiceToken,
  useClass: OrganizationService
};

@Module({
  imports: [
    TeamMembersModule,
    RouterModule.register([{ path: 'organization', module: TeamMembersModule }])
  ],
  controllers: [OrganizationController],
  providers: [organizationServiceProvider]
})
export class OrganizationModule {}
