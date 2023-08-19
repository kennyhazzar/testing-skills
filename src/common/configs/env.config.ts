import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const common = registerAs('common', () => ({
  port: +process.env.PORT,
}));

const database = registerAs('db', () => ({
  uri: process.env.DB_URI,
  name: process.env.DB_NAME,
}));

/**
  const telegram = registerAs('tg', () => ({
  groupId: process.env.GROUP_ID,
  botToken: process.env.BOT_TOKEN,
  }));
 */

const redis = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
}));

export const EnvConfig: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().required(),
    DB_URI: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
  }),
  load: [common, database, redis],
};
