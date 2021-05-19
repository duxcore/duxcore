import { MongoClient } from "mongodb";
import { Server, Socket } from "socket.io";

import { config } from "dotenv";

config();

export class App {
  client!: MongoClient;

  io!: Server;

  constructor() {
    this.client = new MongoClient(process.env.MONGO_URI!);
    this.io = new Server(+(process.env.BACKEND_PORT ?? 8081), {
      cors: {
        // allow frontend
        origin: process.env.FRONTEND_ORIGIN ?? "8080",
      },
    });
  }

  async start(): Promise<void> {
    this.io.on("connection", (socket: Socket) => {
      console.log("Connected to backend");
    });

    try {
      await this.client.connect();

      await this.client.db("backend").command({ ping: 1 });
      console.log("Connected to db");
    } finally {
      this.close();
    }
  }

  async close(): Promise<void> {
    // This will close conn once finished/errored
    this.io.close();
    await this.client.close();
  }
}

const app = new App();

app.start().catch(console.dir);
