const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);

exports.closeServer = function(){
  server.close();
};

module.exports = server;