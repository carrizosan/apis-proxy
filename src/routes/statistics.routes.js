const express = require('express');
const {
  getLastRequests,
  getMostRequestedPaths,
  getRequestsByDate,
} = require('../controllers/statistics.controller');
const router = express.Router();

router.route('/lasts').get(getLastRequests);
router.route('/most-requested').get(getMostRequestedPaths);
router.route('/by-date').get(getRequestsByDate);

module.exports = router;
