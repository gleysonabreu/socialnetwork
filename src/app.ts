import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import Routes from './routes'
import { errors } from 'celebrate'

class App {
  config: express.Application;
  constructor () {
    this.config = express()
    this.middlewares()
    this.routes()
  }

  private middlewares () {
    this.config.use(helmet())
    this.config.use(cors())
    this.config.use(express.json())
  }

  private routes () {
    this.config.use(Routes)
    this.config.use(errors())
  }
}

export default App
