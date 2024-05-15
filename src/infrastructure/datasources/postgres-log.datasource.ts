import { PrismaClient, SeverityLevel } from "@prisma/client";
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

const prismaClient = new PrismaClient();
const severityLevelMapper = {
  low: SeverityLevel.LOW,
  medium: SeverityLevel.MEDIUM,
  high: SeverityLevel.HIGH,
  LOW: LogSeverityLevel.low,
  MEDIUM: LogSeverityLevel.medium,
  HIGH: LogSeverityLevel.high,
};

export class PostgresDatasource implements LogDatasource {
  async saveLog(log: LogEntity): Promise<void> {
    const { message, origin, createdAt, level } = log;
    const newLog = await prismaClient.logModel.create({
      data: {
        message,
        origin,
        createdAt,
        level: severityLevelMapper[`${level}`] as SeverityLevel,
      },
    });
    console.log("Postgres log created");
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logs = await prismaClient.logModel.findMany({
      where: { level: severityLevelMapper[severityLevel] as SeverityLevel },
    });
    return logs.map((log) => {
      const { message, level, createdAt, origin } = log;
      return new LogEntity({
        message,
        createdAt,
        origin,
        level: severityLevelMapper[level] as LogSeverityLevel,
      });
    });
  }
}
