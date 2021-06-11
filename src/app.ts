import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";

class App {
  public app: express.Application;
  public port: string | number;

  constructor(controllers: any, port: string | number) {
    this.app = express();
    this.port = port;
    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
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
    this.app.use(express.json());
    this.app.use(morgan("tiny"));
    this.app.use(express.static("public"));
  }

  private initializeControllers(controllers: any) {
    controllers.forEach((controller: any) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
