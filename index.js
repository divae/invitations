const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

require('./routes/invitationRoutes')(app);

const PORT = process.env.PORT || 5000;
var server = app.listen(PORT);

exports.closeServer = function(){
  server.close();
};
