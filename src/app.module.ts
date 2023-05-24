import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtGuard } from './auth/guards/jwt.guard';
import appConfig, { AppConfig } from './utils/app.config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule, QueryInfo, loggingMiddleware } from 'nestjs-prisma';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig], expandVariables: true }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        prismaOptions: {
          log: ['warn', 'error'],
          errorFormat:
            configService.get<string>('node_env') === 'development' ? 'pretty' : 'minimal',
        },
        prismaServiceOptions: {
          explicitConnect: true,
          middlewares: [
            loggingMiddleware({
              logger: new Logger('Prisma'),
              logLevel: 'log',
              logMessage(query: QueryInfo) {
                return `${query.model}.${query.action}(${query.executionTime}ms)`;
              },
            }),
          ],
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtGuard }],
})
export class AppModule {}
