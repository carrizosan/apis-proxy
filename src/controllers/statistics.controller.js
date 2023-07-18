const { getLastsRequests } = require('../db/cassandra/statistics.repository');

const getStatistics = async (req, res) => {
  const { size } = req.query;
  const requests = await getLastsRequests(size);
  res.json(requests);
};

module.exports = { getStatistics };
