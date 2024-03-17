import express from 'express';
import http from 'http';
import cors from 'cors';
import { corsOption } from './src/helpers/constants/index.ts';
import connection from './src/connections/db.ts';

class Application {
  public app: any;
  public server: http.Server;
  public port: number = 4500;
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
  }

  middlewares() {
    this.app.use(cors(corsOption));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.server.listen(this.port, () => {
      console.log(`Server is listening on ${this.port}`);
    });
  }

  async start() {
    this.connectToDB();
    this.middlewares();
  }

  async connectToDB() {
    await connection.connect();
  }

  getServer() {
    this.start();
    return this.server;
  }
}

export default Application;
