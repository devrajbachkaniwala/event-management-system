import { Module, Provider } from '@nestjs/common';
import { TeamMembersService, teamMembersServiceToken } from './services';
import { TeamMembersController } from './controllers';

const teamMembersServiceProvider: Provider = {
  provide: teamMembersServiceToken,
  useClass: TeamMembersService
};

@Module({
  controllers: [TeamMembersController],
  providers: [teamMembersServiceProvider]
})
export class TeamMembersModule {}
