const logRequests = async (req, res, next) => {
  console.log(`Request IP: ${req.ip} to ${req.path}`);
  next();
};

module.exports = { logRequests };
