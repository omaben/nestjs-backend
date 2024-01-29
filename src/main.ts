import { config } from 'dotenv';
config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import * as cookieParser from 'cookie-parser';
import { LoggingInterceptor } from './log/logging.interceptor';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RatesModule } from './rates/rates.module';
import { FilesModule } from './files/files.module';
import { Log } from './log/log.helper';
import axios from 'axios';
import { GamesModule } from './games/games.module';
import { ModulesModule } from './modules/modules.module';
import { PlayersModule } from './players/players.module';
import { CrashLogsModule } from './crash-logs/crash-logs.module';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    ['/api', '/api-json'],
    basicAuth({
      challenge: true,
      users: {
        developer: process.env.SWAGGER_DEVELOPER_PASSWORD || 'dev@dev',
      },
    }),
  );

  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  // TODO: CORS
  app.enableCors();

  app.use(cookieParser());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('iM-Portal-APIs')
    .setDescription('')
    .setVersion('1.0')
    .addTag('APIs')
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
    {
      include: [
        AuthModule,
        UsersModule,
        RatesModule,
        FilesModule,
        GamesModule,
        ModulesModule,
        PlayersModule,
        CrashLogsModule
      ]
    }
  );

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      withCredentials: true,
      apisSorter: 'alpha',
      tagsSorter: function (a, b) {
        const tagSort = ['auth'];

        return tagSort.indexOf(a) - tagSort.indexOf(b);
      },
      operationsSorter: function (a, b) {
        const methodSort = ['get', 'post', 'patch', 'put', 'delete'];

        if (a.get('path').indexOf('/list') >= 0) return -1;
        if (b.get('path').indexOf('/list') >= 0) return 1;

        return methodSort.indexOf(a.get('method')) - methodSort.indexOf(b.get('method'));
      }
    },
  };

  SwaggerModule.setup('api', app, document, customOptions);

  await app.listen(PORT);

  console.log(`Application is running on:: ${await app.getUrl()}`);

  if (process.env.LOCAL != 'true') {
    axios.get('https://api.ipify.org')
      .then(ipRes => {
        console.log('🚀 |  ', ipRes.data);

        Log.warning({
          type: 'main',
          title: 'start',
          message: `🚀 ${ipRes.data}`,
        });
      })
      .catch(err => {
        console.log('🚀 | ', 'no ip');

        Log.warning({
          type: 'main',
          title: 'start',
          message: `🚀 no ip`,
        });
      })
  }
}

bootstrap();


