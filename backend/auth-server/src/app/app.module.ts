import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule
  ],
  controllers: [],
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
