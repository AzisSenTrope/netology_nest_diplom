import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as passport from 'passport';
import {resolve} from "path";

export const environment = process.env.NODE_ENV;
export const ENV_FILE_PATH = resolve(
    __dirname,
    '..',
    'env',
    `.${environment}.env`,
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config({path: ENV_FILE_PATH});

  const sessionMiddleware = session({
    secret: process.env.AUTH_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 1000 * 60 * 24 * 14,
    },
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT);
}

bootstrap();
