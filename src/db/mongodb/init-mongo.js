const mongoose = require('mongoose');

const HOST_URI = process.env.MONGO_DB_URI;

const connect = async () => {
  try {
    await mongoose.connect(HOST_URI);
    console.log('MongoDB client connected');
  } catch (err) {
    console.log(`Error connecting MongoDB: ${err.message}`);
  }
};

const requestsSchema = new mongoose.Schema({
  path: String,
  method: String,
  ip: String,
  status: Number,
  date: Date,
  errorMessage: String,
});

module.exports = { connect, requestsSchema };
