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
        package: 'user',
        protoPath: join(process.cwd(), 'libs/protos/src/proto/user.proto'),
        url: '0.0.0.0:50051',
      },
    }
  );

  await app.listen();
  Logger.log('🚀 Microservice A (User Service) is listening on port 50051');
}

bootstrap();
