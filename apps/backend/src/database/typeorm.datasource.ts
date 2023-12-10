import { DataSource } from 'typeorm';
import { typeormConnection } from './database.config';

export const AppDataSource = new DataSource({
  ...typeormConnection,
  migrations: ['../migrations/*.{js,ts}'],
});
