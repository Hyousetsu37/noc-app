import { CheckService } from "../domain/use-cases/checks/check-service";
import { CronService } from "./cron/cron-service";
import { LogRepository } from "../domain/repository/log.repository";
import { LogRepositoryImplementation } from "../infrastructure/repositories/log.repository-impl";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";

//create a new instance of the log repository working with the file system
const fileSystemLogRepository = new LogRepositoryImplementation(
  new FileSystemDatasource()
);

export class ServerApp {
  public static start() {
    console.log("Server started...");
    // const url = "https://google.com";
    const url = "http://localhost:3000";
    CronService.createJob("*/5 * * * * *", () => {
      // new CheckService().execute("https://google.com");
      new CheckService(
        fileSystemLogRepository,
        () => console.log(`${url} is up!`),
        (error) => console.log(error)
      ).execute(url);
    });
  }
}
