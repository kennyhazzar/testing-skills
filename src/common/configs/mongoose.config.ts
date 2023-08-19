import {
  MongooseModuleAsyncOptions,
  MongooseModuleFactoryOptions,
} from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfigs } from '../types';

export const MongooseConfig: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): MongooseModuleFactoryOptions => {
    const { name, uri } = configService.get<DatabaseConfigs>('db');

    return {
      uri,
      dbName: name,
    };
  },
};
