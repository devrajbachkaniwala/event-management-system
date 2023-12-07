import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import {
  AccountModule,
  AuthModule,
  PrismaModule,
  SharedModule
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    SharedModule,
    AuthModule,
    AccountModule
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
