import { LogEntity } from "../../../../src/domain/entities/log.entity";
import { CheckService } from "../../../../src/domain/use-cases/checks/check-service";
describe("CheckService UseCase", () => {
  const mockRepository = { saveLog: jest.fn(), getLogs: jest.fn() };
  const successCallback = jest.fn();
  const failedCallback = jest.fn();
  const checkService = new CheckService(
    mockRepository,
    successCallback,
    failedCallback
  );
  const fetchFunct = global.fetch;

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
    expect(mockRepository.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
  });
  test("Should call failedCallback when fetch returns fails", async () => {
    const wasOk = await checkService.execute("https://googleasdafdf.com");
    expect(wasOk).toBe(false);
    expect(successCallback).not.toHaveBeenCalled();
    expect(failedCallback).toHaveBeenCalled();
    expect(mockRepository.saveLog).toHaveBeenCalledWith(expect.any(LogEntity));
  });
  test("Should fail", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const wasOk = await checkService.execute("https://googleffff.com");
    expect(failedCallback).toHaveBeenCalledWith(
      expect.stringContaining("Error on check service")
    );
    global.fetch = fetchFunct;
  });
});
