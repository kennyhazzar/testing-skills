import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CommonConfigs } from './common/types/env.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port } = app.get(ConfigService).get<CommonConfigs>('common');
  await app.listen(port);
}
bootstrap();
