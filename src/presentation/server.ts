import { CheckService } from "../domain/use-cases/checks/check-service";
import { CronService } from "./cron/cron-service";
import { LogRepository } from "../domain/repository/log.repository";
import { LogRepositoryImplementation } from "../infrastructure/repositories/log.repository-impl";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { EmailService } from "./email/email.service";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";

//create a new instance of the log repository working with the file system
const fileSystemLogRepository = new LogRepositoryImplementation(
  new FileSystemDatasource()
);

const emailService = new EmailService();

export class ServerApp {
  public static start() {
    console.log("Server started...");
    // const url = "https://google.com";
    const url = "http://localhost:3000";

    //! EmailService
    // new SendEmailLogs(emailService, fileSystemLogRepository).execute(
    //   "cristiandml3722@gmail.com"
    // );
    // emailService.sendEmailWithFileSystemLogs("cristiandml3722@gmail.com");
    /* emailService.sendEmail({
      to: "cristiandml3722@gmail.com",
      subject: "logssss",
      htmlBody: `
      <h2>Logs of the system - NOC</h2>
      <p>some long text goes here for you to seeeeeeeee</p>
      <p>See attached logs</p>
      `,
    }); */

    //! create a new job that will run every 5 minutes
    // CronService.createJob("*/5 * * * * *", () => {
    //   // new CheckService().execute("https://google.com");
    //   new CheckService(
    //     fileSystemLogRepository,
    //     () => console.log(`${url} is up!`),
    //     (error) => console.log(error)
    //   ).execute(url);
    // });
  }
}
