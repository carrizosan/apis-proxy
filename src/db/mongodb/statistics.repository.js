const { default: mongoose } = require('mongoose');
const { requestsSchema } = require('./init-mongo');
const { DateTime } = require('luxon');

const Request = mongoose.model('request', requestsSchema);

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

const insertRequest = (path, ip, method, status) => {
  try {
    const request = new Request({
      path,
      ip,
      method,
      status,
      date: DateTime.now(),
      errorMessage: null,
    });
    request.save();
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

module.exports = { getLastsRequests, insertRequest, getMostRequestedPaths, getRequestsByDate };
