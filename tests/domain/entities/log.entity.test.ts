import { SeverityLevel } from "@prisma/client";
import {
  LogEntity,
  LogSeverityLevel,
} from "../../../src/domain/entities/log.entity";

describe("log.entity.ts", () => {
  const dataObj = {
    message: "test-message",
    origin: "log.entity.test.ts",
    level: LogSeverityLevel.low,
  };
  test("Should create a LogEntity instance", () => {
    const log = new LogEntity(dataObj);
    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(dataObj.message);
    expect(log.level).toBe(dataObj.level);
    expect(log.origin).toBe(dataObj.origin);
    expect(log.createdAt).toBeInstanceOf(Date);
  });
  test("Should create a LogEntity instance from json", () => {
    const json = `{"message":"http://localhost:3000 is down. Error: TypeError: fetch failed","level":"high","createdAt":"2024-05-14T20:40:30.002Z","origin":"check-service.ts"}`;
    const log = LogEntity.fromJson(json);

    expect(log.message).toBe(
      "http://localhost:3000 is down. Error: TypeError: fetch failed"
    );
    expect(log.level).toBe(LogSeverityLevel.high);
    expect(log.origin).toBe("check-service.ts");
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  test("Should create a LogEntity instance from object", () => {
    const log = LogEntity.fromObject(dataObj);
    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(dataObj.message);
    expect(log.level).toBe(dataObj.level);
    expect(log.origin).toBe(dataObj.origin);
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  test("Should return empty if it is empty", () => {
    const log = LogEntity.fromJson("");
    expect(log.message).toBeUndefined();
    expect(log.level).toBeUndefined();
    expect(log.origin).toBeUndefined();
    expect(log.createdAt).toBeInstanceOf(Date);
  });
});
