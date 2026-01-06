import { Server } from "http";
import app from "./app";
import config from "./app/config";

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });

  process.on("uncaughtException", (error) => {
    console.log(error);
    if (server) {
      server.close(() => {
        console.info("Server close");
      });
    }
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    if (server) {
      server.close(() => {
        console.info("Server close");
      });
    }
  });
}

main();
