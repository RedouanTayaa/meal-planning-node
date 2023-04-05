import { DataSource } from 'typeorm';
import { configService } from './config.service';

export const connectionSource = new DataSource(
  configService.getDataSourceConfig(),
);

connectionSource.initialize();
