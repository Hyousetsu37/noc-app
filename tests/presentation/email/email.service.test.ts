import nodemailer from "nodemailer";

import {
  EmailService,
  SendMailOptions,
} from "../../../src/presentation/email/email.service";

describe("EmailService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  const mockSendMail = jest.fn();
  nodemailer.createTransport = jest.fn().mockReturnValue({
    sendMail: mockSendMail,
  });
  const emailService = new EmailService();
  const email = "cristiandml3722@gmail.com";
  const options: SendMailOptions = {
    to: email,
    subject: "Test",
    htmlBody: "<h1>Test</h1>",
  };
  test("Should send email", async () => {
    const emailSent = await emailService.sendEmail(options);
    expect(mockSendMail).toHaveBeenCalledWith({
      attachments: expect.any(Array),
      html: "<h1>Test</h1>",
      subject: "Test",
      to: email,
    });
  });
  test("Should send email with attachements", async () => {
    await emailService.sendEmailWithFileSystemLogs(email);
    expect(mockSendMail).toHaveBeenCalledWith({
      to: email,
      subject: "Server Logs",
      html: expect.any(String),
      attachments: expect.arrayContaining([
        { filename: "logs-low.log", path: "logs/logs-low.log" },
        { filename: "logs-medium.log", path: "logs/logs-medium.log" },
        { filename: "logs-hight.log", path: "logs/logs-high.log" },
      ]),
    });
  });
  test("Should return false  if a problem arrises", async () => {
    const mockSendMail = jest.fn().mockImplementation(() => {
      throw new Error("some error");
    });
    nodemailer.createTransport = jest.fn().mockReturnValue({
      sendMail: mockSendMail,
    });
    const newEmail = new EmailService();
    const emailSent = await newEmail.sendEmail({
      ...options,
    });
    expect(emailSent).toBeFalsy();
  });
});
