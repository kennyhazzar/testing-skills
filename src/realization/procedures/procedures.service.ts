import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema, UpdateQuery } from 'mongoose';
import { Stats, StatsDocument } from './schemas';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PROCEDURE_JOB_TIMEOUT } from '../../common/constants';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProceduresService {
  private readonly logger = new Logger(ProceduresService.name);

  constructor(
    @InjectModel(Stats.name) private statsModel: Model<StatsDocument>,
    @InjectQueue('ddos_queue') private ddosQueue: Queue<StatsDocument>,
  ) {}

  private async create(procedure: Stats): Promise<void> {
    await this.statsModel.create(procedure);
  }

  async increment(procedureId: MongooseSchema.Types.ObjectId): Promise<void> {
    await this.statsModel.findOneAndUpdate(
      { _id: procedureId },
      { $inc: { count: 1 } },
    );
  }

  async update(
    procedureId: MongooseSchema.Types.ObjectId,
    updateQuery: UpdateQuery<StatsDocument>,
  ): Promise<void> {
    await this.statsModel.findOneAndUpdate({ _id: procedureId }, updateQuery);
  }

  async get(
    procedureId: MongooseSchema.Types.ObjectId,
  ): Promise<StatsDocument | null> {
    return await this.statsModel.findById(procedureId);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async execute() {
    await this.ddosQueue.clean(100);
    const procedures = await this.statsModel.find({ isActive: true });

    if (procedures.length) {
      this.logger.log(
        `good morning! today we have ${procedures.length} procedures!`,
      );
      for (const procedure of procedures) {
        try {
          await this.ddosQueue.add(procedure, {
            timeout: PROCEDURE_JOB_TIMEOUT,
            repeat: {
              every: procedure.interval,
              limit: procedure.limit - procedure.count,
              key: procedure._id,
            },
          });
        } catch (error) {
          this.logger.error(`timeout job (procedure._id): ${procedure._id}`);
        }
      }
    } else {
      this.logger.warn('queue is clear!');
    }
  }
}
