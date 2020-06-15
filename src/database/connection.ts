require('dotenv/config');
import knex from 'knex';

const connection = knex({
  client: 'pg',
  connection: process.env.PG_CONNECTION,
  useNullAsDefault: true,
});

export default connection;