import { MongoClient } from "mongodb";

require("dotenv").config();

export class App {
  client!: MongoClient;

  async start() {
    this.client = new MongoClient(process.env.MONGO_URI!);
    try {
      await this.client.connect();

      await this.client.db("backend").command({ ping: 1 });
      console.log("Connected to db");
    } finally {
      // This will close conn once finished/errored
      await this.client.close();
    }
  }
}

const app = new App();

app.start().catch(console.dir);
