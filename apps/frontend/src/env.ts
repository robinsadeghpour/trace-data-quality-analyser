type NODE_ENV = 'production' | 'development';

export const env = {
  NODE_ENV: process.env.NODE_ENV as NODE_ENV,
  API_URL: process.env.NX_API_URL || '',
  IS_DEV: process.env.NX_IS_DEV === 'true',
};
