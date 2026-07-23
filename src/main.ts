import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { UnexpectedExceptionFilter } from './common/filters/unexpected-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SerializationInterceptor } from './common/interceptors/serialization.interceptor';
import { validationPipeConfig } from './config/validation.config';

const normalizeGlobalPrefix = (prefix: string): string => prefix.replace(/^\/+/, '');
const normalizeSwaggerPath = (path: string): string => path.replace(/^\/+/, '');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const apiPrefix = configService.getOrThrow<string>('app.apiPrefix');
  const port = configService.getOrThrow<number>('app.port');
  const corsOrigins = configService.getOrThrow<string[]>('cors.origins');
  const swaggerEnabled = configService.getOrThrow<boolean>('swagger.enabled');

  app.use(helmet());
  app.setGlobalPrefix(normalizeGlobalPrefix(apiPrefix));
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'X-Request-Id'],
  });
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
  app.useGlobalFilters(
    new UnexpectedExceptionFilter(configService),
    new PrismaExceptionFilter(),
    new HttpExceptionFilter(),
  );
  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector, app.get(JwtService), configService),
    new RolesGuard(reflector),
    new PermissionsGuard(reflector),
  );
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
    new SerializationInterceptor(reflector),
  );

  if (swaggerEnabled) {
    const swaggerPath = configService.getOrThrow<string>('swagger.path');
    const swaggerTitle = configService.getOrThrow<string>('swagger.title');
    const swaggerDescription = configService.getOrThrow<string>('swagger.description');
    const swaggerVersion = configService.getOrThrow<string>('swagger.version');
    const bearerAuthName = configService.getOrThrow<string>('swagger.bearerAuthName');

    const swaggerConfig = new DocumentBuilder()
      .setTitle(swaggerTitle)
      .setDescription(swaggerDescription)
      .setVersion(swaggerVersion)
      .addServer(apiPrefix)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        bearerAuthName,
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(normalizeSwaggerPath(swaggerPath), app, document);
  }

  await app.listen(port);
}

void bootstrap();
