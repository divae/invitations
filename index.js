const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

require('./routes/invitationRoutes')(app);

app.listen(5000);