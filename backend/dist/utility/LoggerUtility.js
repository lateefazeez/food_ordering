"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalErrorLogger = exports.logger = void 0;
const winston_1 = __importStar(require("winston"));
exports.logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.Console(),
        //   log the warnings and errors in a file
        new winston_1.default.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston_1.default.transports.File({ filename: "logs/warn.log", level: "warm" }),
    ],
    //   format the logs
    format: winston_1.default.format.combine(winston_1.default.format.json(), winston_1.default.format.timestamp(), winston_1.default.format.prettyPrint(), winston_1.default.format.metadata()),
});
// format the error message to make it more readable
const loggerFormat = winston_1.default.format.printf(({ level, meta, timestamp }) => {
    return `${timestamp} ${level}: ${meta ? JSON.stringify(meta.message) : ""}`;
});
exports.internalErrorLogger = winston_1.default.createLogger({
    transports: [
        new winston_1.transports.File({ filename: "logs/internalError.log", level: "error" }),
    ],
    format: winston_1.default.format.combine(winston_1.default.format.json(), winston_1.default.format.timestamp(), winston_1.default.format.prettyPrint(), winston_1.default.format.metadata(), loggerFormat),
});
//# sourceMappingURL=LoggerUtility.js.map