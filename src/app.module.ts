import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IncomingMessage } from 'http';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { TasksModule } from './tasks/tasks.module';
import { FilesModule } from './files/files.module';
import { GamesModule } from './games/games.module';
import { ModulesModule } from './modules/modules.module';
import { PlayersModule } from './players/players.module';
import { CrashLogsModule } from './crash-logs/crash-logs.module';

const { DB_DEV, DB_STAGE, DB_MASTER } = process.env;
const DB_CONNECTION_STRINF = DB_DEV || DB_STAGE || DB_MASTER;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(DB_CONNECTION_STRINF),
    GoogleRecaptchaModule.forRoot({
      secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY || '',
      response: (req: IncomingMessage) => (req.headers.recaptcha || '').toString(),
      skipIf: process.env.SKIP_RECAPTCHA === 'true',
      actions: [],
      score: 0.8,
    }),
    TasksModule,
    AuthModule,
    UsersModule,
    FilesModule,
    GamesModule,
    ModulesModule,
    PlayersModule,
    CrashLogsModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    GoogleStrategy
  ],
})

export class AppModule { }
