export default {
  HTTP_PORT: process.env.NODE_ENV === 'production' ? 8080 : 7002,
  RPC_PORT: 8000,
  LOG_PATH: './logs',
};
