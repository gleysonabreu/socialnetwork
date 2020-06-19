import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import Routes from './routes';
import { errors } from 'celebrate';

class App{
  config: express.Application;
  constructor(){
    this.config = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(){
    this.config.use(cors());
    this.config.use(helmet());
    this.config.use(express.json());
    this.config.use(errors());
  }

  private routes(){
    this.config.use(Routes);
  }
}

export default App;