require('dotenv').config();
const { Settings } = require('luxon');
const mongoDB = require('./db/mongodb/init-mongo');
const app = require('./proxy');

const PORT = process.env.PORT || 3000;

Settings.defaultZone = 'America/Argentina/Buenos_Aires';

app.listen(PORT, async () => {
  await mongoDB.connect();
  console.log(`Server listening on port ${PORT}`);
});
