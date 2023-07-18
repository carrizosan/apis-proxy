const cassandra = require('cassandra-driver');

let client = null;

const KEYSPACE = process.env.CASSANDRA_KS;
const TABLE = process.env.CASSANDRA_TABLE;

const getClient = () => {
  if (!client) {
    client = new cassandra.Client({
      contactPoints: [process.env.CASSANDRA_CP],
      localDataCenter: 'datacenter1',
    });
  }
  return client;
};

const createTable = async () => {
  const client = getClient();
  const query = `CREATE TABLE IF NOT EXISTS ${KEYSPACE}.${TABLE} (
    id text PRIMARY KEY,
    date timestamp,
    path text,
    originIP text,
    method text,
    statusCode int,
    errorMessage text
  )`;
  try {
    await client.execute(query);
  } catch (err) {
    console.log(`Error creating table: ${err.message}`);
  }
};

const createKeyspace = async () => {
  const client = getClient();
  const query = `CREATE KEYSPACE IF NOT EXISTS ${KEYSPACE} 
  WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' };`;
  try {
    await client.execute(query);
  } catch (err) {
    console.log(`Error creating keyspace: ${err.message}`);
  }
};

const connect = async () => {
  try {
    const client = getClient();
    await client.connect();
    await createKeyspace();
    await createTable();
    console.log('Cassandra client connected');
  } catch (err) {
    console.log(`Error connecting cassandra DB: ${err.message}`);
  }
};

module.exports = { getClient, connect };
