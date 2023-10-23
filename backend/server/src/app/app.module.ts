import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AccountModule,
  AuthModule,
  EventsModule,
  OrganizationModule,
  PrismaModule,
  SharedModule
} from './modules';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthAccessGuard } from './guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    SharedModule,
    AuthModule,
    AccountModule,
    OrganizationModule,
    EventsModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({ transform: true });
      }
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthAccessGuard
    }
  ]
})
export class AppModule {}
