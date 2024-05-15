import mongoose from "mongoose";
import { MongoDatabase } from "../../../../src/data/mongo/init";
import { LogModel } from "../../../../src/data/mongo/models/log.model";
import { envs } from "../../../../src/config/plugins/envs.plugin";

describe("log.model.test.ts", () => {
  beforeAll(async () => {
    await MongoDatabase.connect({
      mongoUrl: envs.MONGO_URL!,
      dbName: envs.MONGO_DB_NAME!,
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
  test("Should return logModel", async () => {
    const logData = {
      origin: "log.model.test.ts",
      message: "test-message",
      level: "low",
    };
    const log = await LogModel.create(logData);
    expect(log).toEqual(
      expect.objectContaining({
        ...logData,
        id: expect.any(String),
        createdAt: expect.any(Date),
      })
    );
    await LogModel.findByIdAndDelete(log.id);
  });

  test("Should return the schema object", () => {
    const schema = LogModel.schema.obj;
    expect(schema).toEqual(
      expect.objectContaining({
        level: {
          type: expect.any(Function),
          enum: ["low", "medium", "high"],
          required: true,
          default: "low",
        },
        message: { type: expect.any(Function), requied: true },
        origin: expect.any(Function),
        createdAt: expect.any(Object),
      })
    );
  });
});
