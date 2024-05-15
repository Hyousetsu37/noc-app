import {
  LogEntity,
  LogSeverityLevel,
} from "../../../src/domain/entities/log.entity";
import { LogRepositoryImplementation } from "../../../src/infrastructure/repositories/log.repository-impl";
describe("LogRepositoryImpl", () => {
  const mocklogDatasource = { saveLog: jest.fn(), getLogs: jest.fn() };
  const log = new LogEntity({
    message: "test message",
    level: LogSeverityLevel.medium,
    origin: "mongo-log.dastasource.test.ts",
  });
  const impl = new LogRepositoryImplementation(mocklogDatasource);

  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Should call the datasource with arguments when calling saveLog", async () => {
    await impl.saveLog(log);
    expect(mocklogDatasource.saveLog).toHaveBeenCalled();
    expect(mocklogDatasource.saveLog).toHaveBeenCalledWith(log);
  });
  test("Should call the datasource with arguments when calling getLogs", async () => {
    await impl.getLogs(LogSeverityLevel.medium);
    expect(mocklogDatasource.getLogs).toHaveBeenCalled();
    expect(mocklogDatasource.getLogs).toHaveBeenCalledWith(
      LogSeverityLevel.medium
    );
  });
});
