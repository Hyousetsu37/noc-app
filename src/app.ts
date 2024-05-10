import { ServerApp } from "./presentation/server";
(async () => {
  await main();
})();

function main() {
  ServerApp.start();
}
