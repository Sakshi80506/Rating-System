import 'reflect-metadata';
import dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeDatabase } from './database';

dotenv.config();

async function bootstrap() {
  await initializeDatabase();

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = Number(process.env.PORT || 3000);

  await app.listen(port);
  console.log(`Backend listening on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});