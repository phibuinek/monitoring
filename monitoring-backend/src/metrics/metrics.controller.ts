import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly service: MetricsService) {}

  @Post()
  create(@Body() body: CreateMetricDto) {
    return this.service.create(body);
  }

  @Get('top-apps')
  getTopApps() {
    return this.service.getTopApps();
  }
}
