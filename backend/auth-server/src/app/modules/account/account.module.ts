import { Module } from '@nestjs/common';
import { AccountService, accountServiceToken } from './services';
import { AccountController } from './controllers';

@Module({
  providers: [{ provide: accountServiceToken, useClass: AccountService }],
  controllers: [AccountController]
})
export class AccountModule {}
