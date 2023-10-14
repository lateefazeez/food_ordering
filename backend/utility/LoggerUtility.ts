import winston, { transport, transports } from "winston";

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),

    //   log the warnings and errors in a file
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/warn.log", level: "warm" }),
  ],

  //   format the logs
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.prettyPrint(),
    winston.format.metadata()
  ),
});

// format the error message to make it more readable
const loggerFormat = winston.format.printf(({ level, meta, timestamp }) => {
  return `${timestamp} ${level}: ${meta ? JSON.stringify(meta.message) : ""}`;
});

export const internalErrorLogger = winston.createLogger({
  transports: [
    new transports.File({ filename: "logs/internalError.log", level: "error" }),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.prettyPrint(),
    winston.format.metadata(),
    loggerFormat
  ),
});
