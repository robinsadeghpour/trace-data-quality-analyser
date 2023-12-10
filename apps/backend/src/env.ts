type NODE_ENV = 'production' | 'development';

export const env = {
  NODE_ENV: process.env.NODE_ENV as NODE_ENV,
  PORT: Number(process.env.PORT),
  APP_URL: process.env.NX_APP_URL!,
  API_URL: process.env.NX_API_URL!,
  DB_NAME: process.env.NX_DB_NAME,
  DB_HOST: process.env.NX_DB_HOST,
  DB_PORT: Number(process.env.NX_DB_PORT),
  DB_USER: process.env.NX_DB_USER,
  DB_PASSWORD: process.env.NX_DB_PASSWORD,
  DB_SYNC: process.env.NX_DB_SYNC === 'true',
  SESSION_SECRET: process.env.NX_SESSION_SECRET!,
  GOOGLE_CLIENT_ID: process.env.NX_GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_KEY: process.env.NX_GOOGLE_CLIENT_KEY,
};
