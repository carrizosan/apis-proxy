const logRequests = async (req, res, next) => {
  // TODO: Implement Logger service
  console.log(`Request IP: ${req.ip} to ${req.path}`);
  next();
};

module.exports = { logRequests };
