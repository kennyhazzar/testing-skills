import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  PROCEDURE_DEFAULT_INTERVAL,
  PROCEDURE_DEFAULT_LIMIT,
} from '../../../common/constants';

@Schema({ timestamps: true })
export class Stats {
  @Prop()
  procedure: string;
  @Prop()
  url: string;
  @Prop()
  method: string;
  @Prop({ required: false })
  token?: string;
  @Prop({ required: false })
  data?: string;
  @Prop({ default: 0 })
  count?: number;
  @Prop({ default: true })
  isActive?: boolean;
  @Prop({ default: false })
  isStop?: boolean;
  @Prop({ default: PROCEDURE_DEFAULT_INTERVAL })
  interval: number;
  @Prop({ default: PROCEDURE_DEFAULT_LIMIT })
  limit: number;
  @Prop()
  createdAt?: Date;
  @Prop()
  updatedAt?: Date;
}

export type StatsDocument = Stats & Document;
export const StatsSchema = SchemaFactory.createForClass(Stats);
