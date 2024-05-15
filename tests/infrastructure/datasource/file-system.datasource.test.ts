import fs, { existsSync } from "fs";
import path from "path";
import { FileSystemDatasource } from "../../../src/infrastructure/datasources/file-system.datasource";
import { LogDatasource } from "../../../src/domain/datasources/log.datasource";
import {
  LogEntity,
  LogSeverityLevel,
} from "../../../src/domain/entities/log.entity";

describe("FileSystemDatasource", () => {
  const logsPath = path.join(__dirname, "../../../logs");
  const testLog = new LogEntity({
    message: "test message",
    level: LogSeverityLevel.low,
    origin: "file-system.datasource.test.ts",
  });
  beforeEach(() => {
    if (existsSync(logsPath)) {
      fs.rmSync(logsPath, { recursive: true, force: true });
    }
  });

  test("Should create log files if they do not exist", () => {
    new FileSystemDatasource();
    const files = fs.readdirSync(logsPath);
    expect(files).toEqual(["logs-high.log", "logs-low.log", "logs-medium.log"]);
  });

  test("Should save a log in logs-low.log", () => {
    const logDatasource = new FileSystemDatasource();
    const log = new LogEntity(testLog);
    logDatasource.saveLog(log);
    const allLogs = fs.readFileSync(`${logsPath}/logs-low.log`, "utf-8");
    expect(allLogs).toContain(JSON.stringify(log));
  });

  test("Should save a log in logs-medium.log and logs-low.log", () => {
    const logDatasource = new FileSystemDatasource();
    const log = new LogEntity({ ...testLog, level: LogSeverityLevel.medium });
    logDatasource.saveLog(log);
    const lowLogs = fs.readFileSync(`${logsPath}/logs-low.log`, "utf-8");
    const mediumLogs = fs.readFileSync(`${logsPath}/logs-medium.log`, "utf-8");
    expect(lowLogs).toContain(JSON.stringify(log));
    expect(mediumLogs).toContain(JSON.stringify(log));
  });
  test("Should save a log in logs-high.log and logs-low.log", () => {
    const logDatasource = new FileSystemDatasource();
    const log = new LogEntity({ ...testLog, level: LogSeverityLevel.high });
    logDatasource.saveLog(log);
    const lowLogs = fs.readFileSync(`${logsPath}/logs-low.log`, "utf-8");
    const highLogs = fs.readFileSync(`${logsPath}/logs-high.log`, "utf-8");
    expect(lowLogs).toContain(JSON.stringify(log));
    expect(highLogs).toContain(JSON.stringify(log));
  });

  test("should return all logs", async () => {
    const logDatasource = new FileSystemDatasource();
    const logLow = new LogEntity(testLog);
    const logMedium = new LogEntity({
      ...testLog,
      level: LogSeverityLevel.medium,
    });
    const logHigh = new LogEntity({ ...testLog, level: LogSeverityLevel.high });

    await logDatasource.saveLog(logLow);
    await logDatasource.saveLog(logMedium);
    await logDatasource.saveLog(logHigh);

    const logsLow = await logDatasource.getLogs(LogSeverityLevel.low);
    const logsMedium = await logDatasource.getLogs(LogSeverityLevel.medium);
    const logsHigh = await logDatasource.getLogs(LogSeverityLevel.high);

    expect(logsLow).toEqual(
      expect.arrayContaining([logLow, logMedium, logHigh])
    );
    expect(logsMedium).toEqual(expect.arrayContaining([logMedium]));
    expect(logsHigh).toEqual(expect.arrayContaining([logHigh]));
  });

  test("Should not throw an error if path exists", () => {
    new FileSystemDatasource();
    new FileSystemDatasource();
    expect(true).toBeTruthy();
  });

  test("Should throw an error if severity level is not defined", async () => {
    const logDatasource = new FileSystemDatasource();
    const customSeverityLevel = "SUPER_HIGHT" as LogSeverityLevel;

    try {
      await logDatasource.getLogs(customSeverityLevel);
      expect(true).toBeFalsy();
    } catch (error) {
      const errorString = `${error}`;
      expect(errorString).toContain(
        `Error: Unknown severity level for logs: ${customSeverityLevel}`
      );
    }
  });

  test("", async () => {
    const logDatasource = new FileSystemDatasource();
    fs.writeFileSync(`${logsPath}/logs-low.log`, "");
    const emptyLogs = await logDatasource.getLogs(LogSeverityLevel.low);
    expect(emptyLogs).toEqual([]);
  });
});
