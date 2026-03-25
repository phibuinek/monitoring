export class CreateMetricDto {
  deviceId: string;
  timestamp: Date;
  cpu: number;
  memory: number;
  activeApp: string;
}
