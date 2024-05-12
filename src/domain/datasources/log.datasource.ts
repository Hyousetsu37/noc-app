import { LogEntity, LogSeverityLevel } from "../entities/log.entity";

//Stablish the rules so any object we want could be considered a Data Origin
export abstract class LogDatasource {
  abstract saveLog(log: LogEntity): Promise<void>;
  abstract getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]>;
}
