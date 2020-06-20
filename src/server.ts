import App from './app'
require('dotenv/config')

const app = new App()
const port = process.env.PORT || 3333

app.config.listen(port)
