import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Metric } from "./metrics.schema";
import { Model } from "mongoose";
import { CreateMetricDto } from "./dto/create-metric.dto";

@Injectable()
export class MetricsService {
  constructor(@InjectModel(Metric.name) private model: Model<Metric>) {}

  async create(data: CreateMetricDto) {
    try {
      return await this.model.create(data);
    } catch (e) {
      // tránh duplicate crash
      if (e.code === 11000) return null;
      throw e;
    }
  }

  async getTopApps() {
    return this.model.aggregate([
      { $group: { _id: '$activeApp', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
  }
}
