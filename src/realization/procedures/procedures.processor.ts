import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { StatsDocument } from './schemas';
import { ProceduresService } from './procedures.service';
import { Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

@Processor('ddos_queue')
export class ProceduresConsumer {
  private readonly logger = new Logger(ProceduresService.name);

  constructor(private procedureService: ProceduresService) {}

  @Process()
  async execute(job: Job<StatsDocument>) {
    const jobCount = await job.queue.count();
    const data = await this.procedureService.get(job.data._id);
    if (data.limit === jobCount + 1 || data.limit === data.count + 1) {
      data.updateOne({ isActive: false });
    }
    const config: AxiosRequestConfig<any> = {
      url: data.url,
      method: data.method,
    };
    if (data.data) {
      config.data = JSON.parse(data.data);
    }
    if (data.token) {
      config.headers.Authorization = data.token;
    }
    try {
      axios(config);
      await this.procedureService.increment(data._id);
      if (data.limit === data.count + 1) {
        await this.procedureService.update(data._id, { isActive: false });
      }
      this.logger.warn(
        `done request for ${data.url}: ${data.count + 1}; ${
          data.limit === data.count + 1
        }`,
      );
    } catch (error) {
      this.logger.error(`job was down! procedureId: ${data._id}`);
      await job.remove();
    }
  }
}
