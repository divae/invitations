# Pasos para construir el servidor

### Instalación
Es necesario tener instalado NPM, Node , Express , Mocha , Supertest y Docker para arrancar el proyecto.

#### Iniciar npm
Puede visitar : [NPM install](https://www.npmjs.com/package/install)

```sh
$ npm init
```

#### Requerir Express
Puede visitar : [Express](https://www.npmjs.com/package/express)
```sh
$ npm install --save express
```
#### Generar index.js

Contendrá el código del servidor.

```sh
$ touch index.js
```

#### Añadir código para arrancar el servidor

Index.js
```javascript
    const express = require('express');
    const app = express();

    app.get('/', (req,res ) => {
    res.send({hi:'there'});
    });

    app.listen(5000);
```
#### Iniciar el servidor
```sh
$ node index.js
```

#### Puede ver la respuesta en la siguiente ruta

http://localhost:5000/

se espera la siguiente salida
```sh
{"hi":"there"}
```

#### Enrutar manejadores (Route Handlers)

Es interesante meter los routes en una carpeta para tenerlos localizados y restar complejidad al index.js

así que en el raíz generar una carpeta que se llame routes

```sh
$ mkdir routes
```


generar dentro un archivo , yo le he llamado invitationsroutes.js con el siguiente contenido
```sh
$ touch routes/invitationsRoutes.js
```
##### invitationsRoutes.js
```javascript
module.exports = app => {
 
   app.get('/', (req,res ) => {
       res.send({hi:'there'});
   });
};
```


Se modifica el index para añadir esta dependencia, quedando de la siguiente manera.

##### index.js
```javascript
const express = require('express');
const app = express();

require('./routes/invitationRoutes')(app);

app.listen(5000);
```

### Dockerizar

#### Instalar docker 
Éste paso se puede saltar si ya está instalado, el sudo dependerá de los permisos del sistema.

```sh
$ sudo apt install docker.io
```
#### Instalar docker componse
Éste paso se puede saltar si ya está instalado, el sudo dependerá de los permisos del sistema.

```sh
$ sudo apt-get  install docker-compose
```


#### Cambiar el package,json para definir que archivo ejecutará el servidor primero
##### package.json
```javascript
 "scripts": {
   "start": "node index.js"
 },
```
#### Generar el archivo de configuración, por convención se llama Dockerfile sin extensión

```sh
$ touch Dockerfile
```

##### Dockerfile

```sh
FROM node:8.12.0

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app

EXPOSE 5000

CMD ["npm","start"]
```

Generar un docker que se llame invitations y compilar todo dentro (.), éste paso hay que repetirlo cuando se realizen cambios para que se actualize a app dentro de docker
```sh
$ sudo docker build -t invitations .
```

Levantar proyecto usando docker
```sh
$ sudo docker run -it -p 5000:5000  invitations
```

#### Iniciar NPM Mocha
Puede visitar : [NPM mocha](https://www.npmjs.com/package/mocha)

Recordar --save-dev para que sea una dependencia de desarrollo

```sh
$ npm install mocha --save-dev
```

En este punto mocha necesita que le pase la app, para eso separo la lógica en otro fichero par apoder hacerle un export.

```sh
$ mkdir src
$ touch src/app.js
```

##### app.js
```javascript

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

require('../routes/invitationRoutes')(app);

module.exports = app;
```

##### index.js
```javascript
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);

exports.closeServer = function(){
 server.close();
};

module.exports = server;
```

Genero carpeta para los test y el fichero que los contendrá, va a validar que cuando se llama a raiz devuelva el json que toca

```
$ mkdir test
$ touch test/api.test.js
```

##### api.test.js
```javascript
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
```


#### Subir a heroku
Si no tienes instalado el cliente los pasos están aquí
https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
Se añade la variable que distinguirá entre producción y desarrollo

##### Index.js
```javascript
const PORT = process.env.PORT || 5000;
var server = app.listen(PORT);

exports.closeServer = function(){
 server.close();
};
```
#### Iniciar heroku en el servidor

```
$ heroku create
$ git push heroku master
$ mkdir test
```