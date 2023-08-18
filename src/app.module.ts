import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig, MongooseConfig } from './common/configs';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(EnvConfig),
    MongooseModule.forRootAsync(MongooseConfig),
  ],
})
export class AppModule {}
