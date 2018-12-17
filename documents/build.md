# Proyecto de invitaciones

### Tecnologías

* [markdown-it] - Markdown parser done right. Fast and easy to extend.
* [node.js] - evented I/O for the backend
* [mocha] - test
* [Express] - framework para cosntruir apps node.js  [@tjholowaychuk]
* [Docker] - automatiza el despliegue de aplicaciones dentro de contenedores de software

### Instalación
Se requiere [Node.js](https://nodejs.org/) 11+ para funcionar.

Para entornos de desarrollo...

##### Iniciar NPM
```sh
$ cd invitationes
$ npm install -d
```


##### Iniciar npm

```sh
$ npm init
```

### Instalar Express en el servidor

```sh
$ npm install --save express
```
### Generar index.js

Contendrá el código del servidor.

```sh
$ touch index.js
```


Primera prueba con el servidor

Index.js
```javascript
    const express = require('express');
    const app = express();

    app.get('/', (req,res ) => {
    res.send({hi:'there'});
    });

    app.listen(5000);
```



Iniciar el servidor

# node index.js

Para ver el contenido , Ir al navegador y escribir la siguiente ruta

http://localhost:5000/

Veremos una salida como ésta
{"hi":"there"}

Enrutar manejadores (Route Handlers)

Es interesante meter los routes en una carpeta para tenerlos localizados y restar complejidad al index.js

así que en el raíz generar una carpeta que se llame routes

# mkdir routes

generar dentro un archivo , yo le he llamado invitationsroutes.js con el siguiente contenido

# touch routes/invitationsRoutes.js


invitationsRoutes.js
module.exports = app => {
 
   app.get('/', (req,res ) => {
       res.send({hi:'there'});
   });
};

Se modifica el index para añadir esta dependencia

index.js
const express = require('express');
const app = express();

require('./routes/invitationRoutes')(app);

app.listen(5000);


Dockerizar

Instalar docker 

# sudo apt install docker.io

Instalar docker componse

# sudo apt-get  install docker-compose

Cambiar el package,json para definir que archivo ejecutará el servidor primero
package.json
 "scripts": {
   "start": "node index.js",
   "test": "echo \"Error: no test specified\" && exit 1"
 },


generar el archivo de configuración, por convención se llama Dockerfile sin extensión

Dockerfile
FROM node:8.12.0

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app

EXPOSE 5000

CMD ["npm","start"]




Generar un docker que se llame invitations y compilar todo dentro (.), éste paso hay que repetirlo cuando se realizen cambios para que se actualize a app dentro de docker

# sudo docker build -t invitations .

Levantar proyecto usando docker

# sudo docker run -it -p 5000:5000  invitations


Añadir moca, acordarse de poner --save-dev para que sea una dependencia de desarrollo

# npm install mocha --save-dev

En este punto mocha necesita que le pase la app, para eso separo la lógica en otro fichero par apoder hacerle un export.

# mkdir src


# touch src/app.js

app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

require('../routes/invitationRoutes')(app);

module.exports = app;




index.js
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);

exports.closeServer = function(){
 server.close();
};

module.exports = server;



Genero carpeta para los test y el fichero que los contendrá, va a validar que cuando se llama a raiz devuelva el json que toca


# mkdir test


# touch test/api.test.js

api.test..js
const request = require('supertest');
const app = require('../src/app');

const req = request(app);

describe('Integration test example', function() {
   it('get /', function(done) {
       req
           .get('/')
           .set('Accept', 'application/json')
           .expect('Content-Type', /json/)
           .expect(JSON.stringify({ "hi": "world" }))
           .expect(200, done);
   });
});


Subir a heroku
Si no tienes instalado el cliente los pasos están aquí
https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
Se añade la variable que distinguirá entre producción y desarrollo

Index.js
const PORT = process.env.PORT || 5000;
var server = app.listen(PORT);

exports.closeServer = function(){
 server.close();
};

Iniciar heroku en el servidor


# heroku create



# git push heroku master



# mkdir test


