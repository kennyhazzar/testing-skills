import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullConfig, EnvConfig, MongooseConfig } from './common/configs';
import { MongooseModule } from '@nestjs/mongoose';
import { ProceduresModule } from './realization/procedures/procedures.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot(EnvConfig),
    BullModule.forRootAsync(BullConfig),
    MongooseModule.forRootAsync(MongooseConfig),
    ProceduresModule,
  ],
})
export class AppModule {}
