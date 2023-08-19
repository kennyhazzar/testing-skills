import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProceduresService } from './procedures.service';
import { Stats, StatsSchema } from './schemas';
import { BullModule } from '@nestjs/bull';
import { ProceduresConsumer } from './procedures.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Stats.name,
        schema: StatsSchema,
      },
    ]),
    BullModule.registerQueue({ name: 'ddos_queue' }),
  ],
  providers: [ProceduresService, ProceduresConsumer],
})
export class ProceduresModule {}
