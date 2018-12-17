const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(5000, function () {
  console.log('¡Bienvenido! Esperamos que la visita merezca la pena');

  console.log('Visita api en http://localhost:5000/');
});

exports.closeServer = function(){
  server.close();
};

//module.exports = server;