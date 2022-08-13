import log4js from 'log4js';

log4js.configure({
  appenders: {
    console: { type: 'console' },
  },
  categories: {
    default: { appenders: ['console'], level: process.env.LOG_LEVEL || 'info' },
  },
});

export const httpLogger = log4js.getLogger('http');
export const appLogger = log4js.getLogger('app');
export default appLogger;