import winston from 'winston';
import config from '../config';

// Define log format
const logFormat = winston.format.combine(winston.format.timestamp(), config.isDevelopment ? winston.format.colorize() : winston.format.uncolorize(), config.isDevelopment ? winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`) : winston.format.json());

// Create the logger instance
const logger = winston.createLogger({
  level: config.logger.level,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

// Add file transport in production
if (config.isProduction) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
    })
  );
}

export default logger;
