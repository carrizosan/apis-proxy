const statisticsRepository = require('../db/mongodb/statistics.repository');

const getLastRequests = async (req, res) => {
  const { size, page, ip, path, method, status } = req.query;
  const filters = {};
  if (ip) {
    filters.ip = ip;
  }

  if (path) {
    filters.path = path;
  }

  if (method) {
    filters.method = method;
  }

  if (status) {
    filters.status = status;
  }

  try {
    const requests = await statisticsRepository.getLastsRequests(page, size, filters);
    res.json(requests);
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

const getMostRequestedPaths = async (req, res) => {
  try {
    const requests = await statisticsRepository.getMostRequestedPaths();
    res.json(requests);
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

const getRequestsByDate = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    res.status(400).json({
      status: 400,
      error: 'Date from and date to are required',
    });
  }
  try {
    const requests = await statisticsRepository.getRequestsByDate(from, to);
    res.json(requests);
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};

module.exports = { getLastRequests, getMostRequestedPaths, getRequestsByDate };
