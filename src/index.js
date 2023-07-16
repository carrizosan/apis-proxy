require('dotenv').config();
const express = require('express');
const { proxyMiddleware } = require('./middlewares/proxy.middleware');

const app = express();

const PORT = process.env.PORT || 3000;

app.use('/', proxyMiddleware);

app.listen(PORT, () => {
  console.log(`Server listing on port ${PORT}`);
});
