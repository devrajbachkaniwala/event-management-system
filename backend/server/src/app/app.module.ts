import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AccountModule,
  AuthModule,
  OrganizationsModule,
  PrismaModule,
  SharedModule
} from './modules';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    SharedModule,
    AuthModule,
    AccountModule,
    OrganizationsModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({ transform: true });
      }
    }
  ]
})
export class AppModule {}
