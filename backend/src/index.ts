import { createConnection, Connection } from "typeorm";

export class App {
  connection!: Connection | undefined;

  async start() {
    this.connection = await createConnection();
  }
}

const app = new App();
app.start();
