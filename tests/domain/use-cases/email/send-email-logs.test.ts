import { SendMailOptions } from "nodemailer";
import { SendEmailLogs } from "../../../../src/domain/use-cases/email/send-email-logs";
import { EmailService } from "../../../../src/presentation/email/email.service";
import { LogRepository } from "../../../../src/domain/repository/log.repository";
import { LogEntity } from "../../../../src/domain/entities/log.entity";
describe("SendEmailLogs", () => {
  const mockEmailService = {
    sendEmailWithFileSystemLogs: jest.fn().mockReturnValue(true),
  };
  const mockLogRepository: LogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const sendEmailLogs = new SendEmailLogs(
    mockEmailService as any,
    mockLogRepository
  );
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Should call sendEmail and savelog", async () => {
    const result = await sendEmailLogs.execute("cristiandml3722@gmail.com");
    expect(result).toBe(true);
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledTimes(
      1
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith({
      createdAt: expect.any(Date),
      level: "low",
      message: "Email sent to cristiandml3722@gmail.com ",
      origin: "send-email-logs.ts",
    });
  });
  test("Should log in case of error", async () => {
    mockEmailService.sendEmailWithFileSystemLogs.mockResolvedValue(false);
    const result = await sendEmailLogs.execute("cristiandml3722@gmail.com");
    expect(result).toBe(false);
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledTimes(
      1
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
    expect(mockLogRepository.saveLog).toHaveBeenCalledWith({
      createdAt: expect.any(Date),
      level: "high",
      message:
        "Email not sent to cristiandml3722@gmail.com due to an error: Error: Email log not sent",
      origin: "send-email-logs.ts",
    });
  });
});
