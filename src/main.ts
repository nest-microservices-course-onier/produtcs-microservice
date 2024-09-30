import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

import { envs } from './config';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);

  // console.log(envs.natsServers); // only for test NATS_SERVERS env variable

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        // servers: ['nats://localhost:4222'], // without env file
        servers: envs.natsServers, // with NATS_SERVERS in the env file 
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  console.log(`Product microservice running on PORT: ${envs.port}`)
}
bootstrap();
