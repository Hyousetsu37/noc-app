import { envs } from "../../../src/config/plugins/envs.plugin";
describe("envs.plugin.ts", () => {
  test("Should return env options", () => {
    expect(envs).toEqual({
      PORT: 3000,
      MAILER_EMAIL: "davidlopeznoticias@gmail.com",
      MAILER_PASSWORD: "pnuapazntjeoncur",
      MAILER_SERVICE: "gmail",
      MONGO_URL: "mongodb://cristian:123456@localhost:27017/",
      MONGO_DB_NAME: "NOC",
      MONGO_USER: "cristian",
      MONGO_PASS: "123456",
    });
  });

  test("Should return error if not found env", async () => {
    jest.resetModules();
    process.env.PORT = "ABC";

    try {
      await import("../../../src/config/plugins/envs.plugin");
      expect(true).toBe(false);
    } catch (error) {
      expect(`${error}`).toContain('"PORT" should be a valid integer');
    }
  });
});
