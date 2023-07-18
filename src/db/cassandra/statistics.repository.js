const { ulid } = require('ulid');
const { getClient } = require('./init-cassandra');
const { DateTime } = require('luxon');

const client = getClient();

const getLastsRequests = async (size = 20) => {
  const query = `SELECT * FROM apis_proxy.requests LIMIT ?`;
  const { rows, rowLength } = await client.execute(query, [size], { prepare: true });

  const response = {
    data: rows,
    info: { itemsByPage: size, itemsInPage: rowLength },
  };

  return response;
};

const insertRequest = async (path, ip, method, statusCode) => {
  const id = ulid();
  const now = DateTime.now().toJSDate();

  const query = `INSERT INTO apis_proxy.requests
  (id, date, path, originIP, method, statusCode)
  VALUES (?, ?, ?, ?, ?, ?);`;

  client.execute(query, [id, now, path, ip, method, statusCode], { prepare: true });
};

module.exports = { getLastsRequests, insertRequest };
