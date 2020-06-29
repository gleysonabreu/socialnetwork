import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { errors } from "celebrate";
import Routes from "./routes";
import AppError from "./AppError";

class App {
  config: express.Application;

  constructor() {
    this.config = express();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.config.use(helmet());
    this.config.use(cors());
    this.config.use(express.json());
    this.config.use(express.urlencoded({ extended: true }));
  }

  private routes() {
    this.config.use(Routes);
    this.config.use(errors());
    this.config.use(
      (err: Error, request: Request, response: Response, _: NextFunction) => {
        if (err instanceof AppError) {
          return response.status(err.statusCode).json({
            status: "Error",
            message: err.message,
          });
        }

        console.log(err);

        return response.status(500).json({
          status: "Error",
          message: "Internal server error.",
        });
      }
    );
  }
}

export default App;
