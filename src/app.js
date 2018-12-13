const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

require('../routes/invitationRoutes')(app);

module.exports = app;