import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import db from './database/models'
import { Controller } from './utils/interfaces/controller.interface';
import { errorHandler } from './middlewares/error.middleware';
import { notFound } from './middlewares/notFound.middleware';

export class App {
  private app: Application;
  private port: number;

  constructor(controllers: Controller[], port: number | any) {
    this.app = express();
    this.port = port
    //this.server = http.createServer(this.app);
    this.connectToDB()
    this.initialiseMiddlewares()
    this.initialiseController(controllers)
    this.initialiseErrorHandling()
  }

  private initialiseMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet())
    this.app.use(express.urlencoded({ extended: false }));
    
  }

  private initialiseErrorHandling(): void {
    this.app.use(notFound)
    this.app.use(errorHandler);
  }

  private initialiseController(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use('/api/v1', controller.router);
    });
  }

  async start() {
    this.app.listen(this.port, () => {
      console.log(`Server is listening on ${this.port}`);
    });
  }

  private async connectToDB() {
    //await connection.connect();
    try {
      await db.sequelize.sync({force: true})
      await db.sequelize.authenticate()
      console.log('Connected to database');
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

}
