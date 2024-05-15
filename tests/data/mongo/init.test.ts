import mongoose from "mongoose";
import { MongoDatabase } from "../../../src/data/mongo/init";
describe("init MongoDB", () => {
  afterAll(() => {
    mongoose.connection.close();
  });
  test("Should connect to MongoDB", async () => {
    const connected = await MongoDatabase.connect({
      mongoUrl: process.env.MONGO_URL!,
      dbName: process.env.MONGO_URL!,
    });
    expect(connected).toBeTruthy();
  });
  test("Should throw an error", async () => {
    try {
      const connected = await MongoDatabase.connect({
        mongoUrl: "mongodb://cristian:123asdsd456@localhost:27017/",
        dbName: "mongodb://cristian:123asdsd456@localhost:27017/",
      });
    } catch (error) {}
  });
});
