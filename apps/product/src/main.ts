import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'product',
        protoPath: join(process.cwd(), 'libs/protos/src/proto/product.proto'),
        url: '0.0.0.0:50052',
      },
    }
  );

  await app.listen();
  Logger.log('🚀 Microservice B (Product Service) is listening on port 50052');
}

bootstrap();
