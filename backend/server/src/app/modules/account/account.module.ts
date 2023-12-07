import { Module, Provider } from '@nestjs/common';
import { AccountService, accountServiceToken } from './services';
import { AccountController } from './controllers';

const accountServiceProvider: Provider = {
  provide: accountServiceToken,
  useClass: AccountService
};

@Module({
  providers: [accountServiceProvider],
  controllers: [AccountController]
})
export class AccountModule {}
