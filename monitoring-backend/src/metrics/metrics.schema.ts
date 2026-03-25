import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Metric {
  @Prop()
  deviceId: string;

  @Prop()
  timestamp: Date;

  @Prop()
  cpu: number;

  @Prop()
  memory: number;

  @Prop()
  activeApp: string;
}

export const MetricSchema = SchemaFactory.createForClass(Metric);

MetricSchema.index({ deviceId: 1, timestamp: 1 }, { unique: true });
