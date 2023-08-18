import { ConfigModuleOptions, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const common = registerAs('common', () => ({
  port: +process.env.PORT,
}));

const database = registerAs('db', () => ({
  uri: process.env.DB_URI,
  name: process.env.DB_NAME,
}));

export const EnvConfig: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().required(),
    DB_URI: Joi.string().required(),
    DB_NAME: Joi.string().required(),
  }),
  load: [common, database],
};
