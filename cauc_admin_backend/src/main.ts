import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // 启用全局验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 允许任何跨域
  app.enableCors();
  await app.listen(3333);

}
bootstrap();
