const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.send('hello world');
});

app.listen(PORT, () => {
  console.log(`Server listing on port ${PORT}`);
});
