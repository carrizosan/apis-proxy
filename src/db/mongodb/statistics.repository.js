const { default: mongoose } = require('mongoose');
const { requestsSchema } = require('./init-mongo');
const { DateTime } = require('luxon');

const Request = mongoose.model('request', requestsSchema);

/**
 * Get lasts requests paginated and optionally filtered
 * @param {number} [page=1] - page number
 * @param {number} [size=20] - page size
 * @param {Object} [filters]
 * @param {string} [filters.ip]
 * @param {string} [filters.path]
 * @param {string} [filters.method]
 * @param {number} [filters.status]
 * @returns An array of requests ordered by date desc, and pagination info.
 */
const getLastsRequests = async (page = 1, size = 20, filters) => {
  try {
    const requests = await Request.find(filters)
      .sort({ date: -1 })
      .skip((page - 1) * size)
      .limit(size);

    const response = {
      data: requests,
      info: {
        page: +page,
        itemsByPage: +size,
        itemsInPage: requests.length,
      },
    };
    return response;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

/**
 * Get a list of most requested paths
 * @returns An array of most requested paths and the count ordered by count desc.
 */
const getMostRequestedPaths = async () => {
  try {
    const requests = await Request.aggregate([
      {
        $group: {
          _id: { path: '$path', method: '$method' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    const response = requests.map((req) => {
      return { path: req._id.path, count: req.count };
    });
    return response;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

/**
 * Get all the requests between the given dates
 * @param {Date} from - start datetime
 * @param {Date} to - end datetime
 * @returns An array of requests filtered by dates, with no pagination.
 */
const getRequestsByDate = async (from, to) => {
  try {
    const dateFrom = DateTime.fromISO(from);
    const dateTo = DateTime.fromISO(to);
    const requests = await Request.find({
      date: { $gte: dateFrom, $lte: dateTo },
    });
    return requests;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

/**
 * Insert a new request in MongoDB collection
 * @param {string} path - requested path
 * @param {string} ip - origin ip
 * @param {string} method - requested method
 * @param {number} status - response status code
 */
const insertRequest = (path, ip, method, status, errorMessage = null) => {
  try {
    const request = new Request({
      path,
      ip,
      method,
      status,
      date: DateTime.now(),
      errorMessage,
    });
    request.save();
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

module.exports = { getLastsRequests, insertRequest, getMostRequestedPaths, getRequestsByDate };
