import nodemailer from "nodemailer";
import { envs } from "../../config/plugins/envs.plugin";
import { LogRepository } from "../../domain/repository/log.repository";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments: Attachement[];
}

interface Attachement {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: { user: envs.MAILER_EMAIL, pass: envs.MAILER_PASSWORD },
  });

  constructor(/* private readonly logRepository: LogRepository */) {}

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;
    try {
      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      });

      // console.log(sentInformation);

      // const log = new LogEntity({
      //   level: LogSeverityLevel.low,
      //   message: `Email sent to ${Array.isArray(to) ? to.join(" ") : to} `,
      //   origin: "email.service.ts",
      // });
      // this.logRepository.saveLog(log);

      return true;
    } catch (error) {
      // const log = new LogEntity({
      //   level: LogSeverityLevel.low,
      //   message: `Email not sent to ${
      //     Array.isArray(to) ? to.join(" ") : to
      //   } due to an error: ${error}`,
      //   origin: "email.service.ts",
      // });
      // this.logRepository.saveLog(log);
      return false;
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = "Server Logs";
    const htmlBody = `
    <h2>Logs of the system - NOC</h2>
    <p>some long text goes here for you to seeeeeeeee</p>
    <p>See attached logs</p>
    `;
    const attachments: Attachement[] = [
      { filename: "logs-low.log", path: "logs/logs-low.log" },
      { filename: "logs-medium.log", path: "logs/logs-medium.log" },
      { filename: "logs-hight.log", path: "logs/logs-high.log" },
    ];
    return this.sendEmail({
      to,
      subject,
      attachments,
      htmlBody,
    });
  }
}
