import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { env } from '../env';
import { TraceDataAnalysisEntity } from '../api/trace-data-analysis/trace-data-analysis.entity';
import { UserEmailEntity } from '../api/user-email/user-email.entity';

export const mongoConnection = {
  host: env.DB_HOST,
  // user: env.DB_USER,
  // password: env.DB_PASSWORD,
  port: env.DB_PORT,
  database: env.DB_NAME,
  // ssl: env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false,
};

export const typeormConnection: MongoConnectionOptions = {
  ...mongoConnection,
  type: 'mongodb',
  synchronize: env.DB_SYNC,
  entities: [TraceDataAnalysisEntity, UserEmailEntity],
};
