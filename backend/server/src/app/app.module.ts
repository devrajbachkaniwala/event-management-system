import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AccountModule,
  AuthModule,
  BookingsModule,
  EventsModule,
  OrganizationModule,
  PrismaModule,
  SharedModule,
  UsersModule
} from './modules';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthAccessGuard } from './guards';
import { DaoModule } from './modules/dao/dao.module';

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
    EventsModule,
    BookingsModule,
    UsersModule,
    DaoModule
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
