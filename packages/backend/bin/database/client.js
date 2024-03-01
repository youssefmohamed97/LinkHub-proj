import pg from 'pg';

const client = new pg.Client({
  host: 'localhost',
  user: 'postgres',
  port: 12432,

});

export default client;
