import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckServiceMultiple implements CheckServiceUseCase {
  constructor(
    //Depenency inejection
    private readonly logRepositories: LogRepository[],
    private readonly sucessCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {}

  private callLogs(log: LogEntity) {
    this.logRepositories.forEach((logRepo) => logRepo.saveLog(log));
  }

  public async execute(url: string): Promise<boolean> {
    try {
      //Make a call to the passed url
      const req = await fetch(url);
      //If the response is not ok, throw new Error
      if (!req.ok) throw new Error(`Error on check service ${url}`);

      //Instantiate the new entity with the desired information if it succeeds
      const log = new LogEntity({
        message: `Check service ${url} success`,
        level: LogSeverityLevel.low,
        origin: "check-service.ts",
      });
      //use the repository to send the instantiated log to the datasource
      this.callLogs(log);
      //If a success callback was given, then call it
      this.sucessCallback && this.sucessCallback();
      //Return true if all ended successfully
      return true;
    } catch (error) {
      //If there was an error, for example the response to the fetch being not ok, set the error message
      const errorMessage = `${url} is down. Error: ${error}`;
      //Instantiate the new entity with the desired information if it fails
      const log = new LogEntity({
        message: errorMessage,
        level: LogSeverityLevel.high,
        origin: "check-service.ts",
      });
      //use the repository to send the instantiated log to the datasource
      this.callLogs(log);
      this.errorCallback && this.errorCallback(errorMessage);
      return false;
    }
  }
}
