const NODE_ENV = process.env.NODE_ENV;

export default {
  LOG_PATH: process.env.LOG_PATH || './logs',
  HTTP_PORT: NODE_ENV === 'production' ? 8080 : 7001,
  RPC_PORT: 8000,

  LOG_CMD_LEVEL: NODE_ENV === 'production' ? 'info' : NODE_ENV === 'test' ? 'error' : 'debug',
  LOG_FILE_LEVEL: NODE_ENV === 'production' ? 'info' : 'debug',
};
