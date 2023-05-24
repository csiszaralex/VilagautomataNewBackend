import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('START');
  const port = configService.get('port');
  const node_env = configService.get('node_env');

  if (node_env === 'development') CreateSwagger(app);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  await app.listen(port, () => {
    logger.debug(`---------- Server started on port ${port} in ${node_env} mode ----------`);
  });
}
async function CreateSwagger(app: INestApplication) {
  const TITLE = 'VilagautomataAPI';
  const configSW = new DocumentBuilder()
    .setTitle(TITLE)
    .setDescription('Vilagautomata API dokumentáció')
    .setVersion(process.env.npm_package_version || '0.1.0')
    .build();
  const documentOptions: SwaggerDocumentOptions = { ignoreGlobalPrefix: true };
  const customOptions: SwaggerCustomOptions = {
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customSiteTitle: TITLE,
  };

  const document = SwaggerModule.createDocument(app, configSW, documentOptions);
  SwaggerModule.setup('api', app, document, customOptions);
}
bootstrap();
