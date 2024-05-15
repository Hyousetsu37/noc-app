import { PostgresDatasource } from "../../../src/infrastructure/datasources/postgres-log.datasource";
import {
  LogEntity,
  LogSeverityLevel,
} from "../../../src/domain/entities/log.entity";
import { PrismaClient } from "@prisma/client/extension";

describe("PostgresDatasource", () => {
  const logDataSource = new PostgresDatasource();

  const log = new LogEntity({
    message: "test message",
    level: LogSeverityLevel.medium,
    origin: "mongo-log.dastasource.test.ts",
  });
  test("Should create a log", async () => {
    const mockLog = jest.spyOn(console, "log");
    await logDataSource.saveLog(log);
    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith("Postgres log created");
  });
  test("Should get a log", async () => {
    await logDataSource.saveLog(log);
    const logs = logDataSource.getLogs(LogSeverityLevel.medium);
    expect((await logs).length).toBeGreaterThan(3);
  });
});
