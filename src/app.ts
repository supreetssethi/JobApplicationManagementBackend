import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";

class App {
  public app: express.Application;
  public port: string | number;

  constructor(controllers: Controller[], port: string | number) {
    this.app = express();
    this.port = port;
    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }
  private initializeDatabase() {
    const connectionURL = "mongodb://127.0.0.1:27017";
    const databaseName = "job-application-trackers";

    mongoose
      .connect(`${connectionURL}/${databaseName}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("DB Connection Successfull"))
      .catch((err: Error) => {
        console.error(err);
      });
  }
  private initializeMiddlewares() {
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(morgan("tiny"));
    this.app.use(express.static("public"));
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
