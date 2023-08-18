import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfigs } from '../types/env.type';

export const MongooseConfig: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<unknown> => {
    const { name, uri } = configService.get<DatabaseConfigs>('db');

    return {
      uri,
      dbName: name,
    };
  },
};
