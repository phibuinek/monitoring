import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/monitoring'),
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
