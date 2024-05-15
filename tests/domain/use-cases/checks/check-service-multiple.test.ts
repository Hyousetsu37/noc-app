import { LogEntity } from "../../../../src/domain/entities/log.entity";
import { CheckService } from "../../../../src/domain/use-cases/checks/check-service";
import { CheckServiceMultiple } from "../../../../src/domain/use-cases/checks/check-service-multiple";

describe("CheckServiceMultiple UseCase", () => {
  const mockRepo1 = { saveLog: jest.fn(), getLogs: jest.fn() };
  const mockRepo2 = { saveLog: jest.fn(), getLogs: jest.fn() };
  const mockRepo3 = { saveLog: jest.fn(), getLogs: jest.fn() };

  const successCallback = jest.fn();
  const failedCallback = jest.fn();
  const checkService = new CheckServiceMultiple(
    [mockRepo1, mockRepo2, mockRepo3],
    successCallback,
    failedCallback
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("Should call successCallback when fetch returns true", async () => {
    const wasOk = await checkService.execute("https://google.com");
    expect(wasOk).toBe(true);
    expect(successCallback).toHaveBeenCalled();
    expect(failedCallback).not.toHaveBeenCalled();
    expect(mockRepo1.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(mockRepo2.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(mockRepo3.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
  });
  test("Should call failedCallback when fetch returns fails", async () => {
    const wasOk = await checkService.execute("https://googleasde.com");
    expect(wasOk).toBe(false);
    expect(successCallback).not.toHaveBeenCalled();
    expect(failedCallback).toHaveBeenCalled();
    expect(mockRepo1.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(mockRepo2.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
    expect(mockRepo3.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
  });
  test("Should fail", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const wasOk = await checkService.execute("https://googleffff.com");
    expect(failedCallback).toHaveBeenCalledWith(
      expect.stringContaining("Error on check service")
    );
  });
});
