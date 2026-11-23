import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module.js';
import { HttpToRpcExceptionFilter } from './module/presentation/filters/http-to-rpc-exception.filter.js';

const USER_QUEUE_NAME = 'user_queue';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: USER_QUEUE_NAME,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.useGlobalFilters(new HttpToRpcExceptionFilter());
  await app.listen();
}

bootstrap();
