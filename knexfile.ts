require('dotenv/config');
import path from 'path';
module.exports = {
  client: 'pg',
  connection: process.env.PG_CONNECTION,
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  }
}