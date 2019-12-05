export default {
  LOG_PATH: './logs',
  HTTP_PORT: process.env.NODE_ENV === 'production' ? 8080 : 7002,
  RPC_PORT: 8000,
};
