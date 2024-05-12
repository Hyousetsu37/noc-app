import { CheckService } from "../domain/use-cases/checks/check-service";
import { CronService } from "./cron/cron-service";
import { LogRepository } from "../domain/repository/log.repository";
import { LogRepositoryImplementation } from "../infrastructure/repositories/log.repository-impl";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { EmailService } from "./email/email.service";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { LogSeverityLevel } from "../domain/entities/log.entity";
import { PostgresDatasource } from "../infrastructure/datasources/postgres-log.datasource";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";

//create a new instance of the log repository working with the file system
const logRepository = new LogRepositoryImplementation(
  // new FileSystemDatasource()
  //new MongoLogDatasource()
  new PostgresDatasource()
);

const emailService = new EmailService();

export class ServerApp {
  public static async start() {
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

    // console.log(await logRepository.getLogs(LogSeverityLevel.medium));

    //! create a new job that will run every 5 minutes
    // CronService.createJob("*/30 * * * * *", () => {
    //   // new CheckService().execute("https://google.com");
    //   new CheckService(
    //     logRepository,
    //     () => console.log(`${url} is up!`),
    //     (error) => console.log(error)
    //   ).execute(url);
    // });

    //! create a new job that will run every 5 minutes to multiple datasources
    const fsRepo = new LogRepositoryImplementation(new FileSystemDatasource());
    const mongoRepo = new LogRepositoryImplementation(new MongoLogDatasource());
    const postRepo = new LogRepositoryImplementation(new PostgresDatasource());

    CronService.createJob("*/30 * * * * *", () => {
      // new CheckService().execute("https://google.com");
      new CheckServiceMultiple(
        [fsRepo, mongoRepo, postRepo],
        () => console.log(`${url} is up!`),
        (error) => console.log(error)
      ).execute(url);
    });
  }
}
