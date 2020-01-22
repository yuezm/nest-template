export default {
  LOG_PATH: './logs',
  HTTP_PORT: process.env.NODE_ENV === 'production' ? 8080 : 7001,
  RPC_PORT: 8000,

  LOG_CMD_LEVEL: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  LOG_FILE_LEVEL: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
};
