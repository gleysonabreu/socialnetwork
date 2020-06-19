require('dotenv/config');
import App from './app';

const app = new App();
const port = process.env.PORT || 3333;

app.config.listen(port);