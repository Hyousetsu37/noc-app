import {
  appendFileSync,
  existsSync,
  mkdir,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class FileSystemDatasource implements LogDatasource {
  private readonly logsPath = "./logs";
  private readonly lowLogsPath = "./logs/logs-low.log";
  private readonly mediumLogsPath = "./logs/logs-medium.log";
  private readonly highLogsPath = "./logs/logs-high.log";

  constructor() {
    this.createLogsFiles();
  }

  private createLogsFiles = () => {
    //Create logs folder if not exists
    if (!existsSync(this.logsPath)) {
      mkdirSync(this.logsPath);
    }
    //Create logs files if not exists
    [this.lowLogsPath, this.mediumLogsPath, this.highLogsPath].forEach(
      (path) => {
        //If file exists, do nothnig else create it and write empty file
        if (existsSync(path)) return;
        writeFileSync(path, "");
      }
    );
  };

  public async saveLog(log: LogEntity): Promise<void> {
    const logAsJson = `${JSON.stringify(log)}\n`;
    //Save all logs to logs-low.log
    appendFileSync(this.lowLogsPath, logAsJson);
    //Save only medium logs to logs-medium.log
    if (log.level === LogSeverityLevel.medium) {
      appendFileSync(this.mediumLogsPath, logAsJson);
    }
    //Save only high logs to logs-high.log
    if (log.level === LogSeverityLevel.high) {
      appendFileSync(this.highLogsPath, logAsJson);
    }
  }

  private getLogsFromFile = (path: string): LogEntity[] => {
    // const logs = readFileSync(path, "utf-8").toString().split("\n");
    const logs = readFileSync(path, "utf-8");
    if (logs === "") return [];
    return logs
      .trim()
      .split("\n")
      .map((log) => LogEntity.fromJson(log));
  };

  public async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    switch (severityLevel) {
      case LogSeverityLevel.low:
        return this.getLogsFromFile(this.lowLogsPath);
      case LogSeverityLevel.medium:
        return this.getLogsFromFile(this.mediumLogsPath);
      case LogSeverityLevel.high:
        return this.getLogsFromFile(this.highLogsPath);
      default:
        throw new Error(`Unknown severity level for logs: ${severityLevel}`);
    }
  }
}
