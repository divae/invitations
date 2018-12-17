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

podemos ver en el archivo `package.json` que se ha añadido la dependencia de express en el apartado `dependencies`, este es el archivo que se revisa para añadir las dependencias al proyecto mediante `npm init`

##### `pacage.json`
```javascript
 "dependencies": {
    "express": "^4.16.4"
  }
```

#### Generar index.js

Contendrá el código del servidor.

```sh
$ touch index.js
```

#### Añadir código para arrancar el servidor
>Reemplazar el contenido del fichero por el siguiente código.

##### `index.js`
```javascript
const express = require('express');
const app = express();

app.get('/', (req,res ) => {
    res.send({hi:'there'});
});

const server = app.listen(5000, function () {
    console.log('¡Bienvenido! Esperamos que la visita merezca la pena');

    console.log('Visita api en http://localhost:5000/');
});
```
#### Iniciar el servidor
```sh
$ node index.js
```

#### Parar el servidor
```sh
CTRL + c
```

#### Puede ver la respuesta en la siguiente ruta

`Ver servidor` : <http://localhost:5000>


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
>Reemplazar el contenido del fichero por el siguiente código.
##### `invitationsRoutes.js`
```javascript
module.exports = app => {
 
   app.get('/', (req,res ) => {
       res.send({hi:'there'});
   });
};
```


Se modifica el index para añadir esta dependencia, quedando de la siguiente manera.
>Reemplazar el contenido del fichero por el siguiente código.
##### `index.js`

```javascript
const express = require('express');
const app = express();

require('./routes/invitationsRoutes')(app);

const server = app.listen(5000, function () {
    console.log('¡Bienvenido! Esperamos que la visita merezca la pena');

    console.log('Visita api en http://localhost:5000/');
});
```
> Es interesante comprobar que todo sigue correndo correctamente, así que volveremos a arrancar el servidor.
```sh
$ node index.js
```



## Docker
Puede visitar : [Docker](https://www.docker.com/)

#### Instalar docker 
>Éste paso se puede saltar si ya está instalado, el sudo dependerá de los permisos del sistema.

```sh
$ sudo apt install docker.io
```
#### Instalar docker componse
>Éste paso se puede saltar si ya está instalado, el sudo dependerá de los permisos del sistema.

```sh
$ sudo apt-get  install docker-compose
$ sudo 
```

> puedes ver los docker arrancados con 
```
    sudo docker ps
```


#### Configurar el package.json
Se configura en start el comando que llamará la aplicación cuando se ejecute el comando `"npm start"`, en éste caso sería igual que llamar a `"node index.js"`.

##### `package.json`
```javascript
 "scripts": {
   "start": "node index.js"
 },
```
#### Generar el archivo de configuración para Docker

Por convención se llama `Dockerfile` sin extensión

```sh
$ touch Dockerfile
```
>Reemplazar el contenido del fichero por el siguiente código.

##### `Dockerfile`

```sh
FROM node:8.12.0

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app

EXPOSE 5000

CMD ["npm","start"]
```

Generar un docker que se llame `invitations` y compilar todo dentro `.`, éste paso hay que repetirlo cuando se realizen cambios para que se actualize a app generada dentro de docker
```sh
$ sudo docker build -t invitations .
```

Levantar proyecto usando docker
```sh
$ sudo docker run -it -p 5000:5000  invitations
```

## NPM MOCHA y SUPERTEST

#### Iniciar NPM Mocha para tests
Puede visitar : [NPM mocha](https://www.npmjs.com/package/mocha)

>Recordar --save-dev para que sea una dependencia de desarrollo


```sh
$ npm install mocha --save-dev
$ npm install supertest --save-dev
```
aqui si valos a `package.json` veremos que se han añadido las dos dependencias en el apartado `devDependencies` que es el pensado para el desarrollo.

##### `pacage.json`
```javascript
  "devDependencies": {
    "mocha": "^5.2.0",
    "supertest": "^3.3.0"

  }
```
En este punto mocha necesita que le pase la app, para eso separo la lógica en otro fichero par apoder hacerle un export.

```sh
$ mkdir src
$ touch src/app.js
```
>Reemplazar el contenido del fichero por el siguiente código.

##### `app.js`
```javascript

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

require('../routes/invitationRoutes')(app);

module.exports = app;
```
>Reemplazar el contenido del fichero por el siguiente código.

##### `index.js`
```javascript
const app = require('./src/app');
const local_port = 5000;
const server_port = process.env.PORT;

const PORT = server_port || local_port;
const server = app.listen(local_port, function () {
    console.log('¡Bienvenido! Esperamos que la visita merezca la pena');

    console.log(`Visita api en http://localhost:${local_port}/`);
});

exports.closeServer = function(){
    server.close();
};

module.exports = server;
```

> compilar de nuevo el docker y volver a probar el servidor

```sh
$ sudo docker build -t invitations .
$ sudo docker run -it -p 5000:5000  invitations
```


Generar una carpeta para los test y el fichero que los contendrá, va a validar que cuando se llama a raiz devuelva el json que toca

```
$ mkdir test
$ touch test/api.test.js
```
> todos los achivos de test acabaran con `.test.js` para que mocha los reconozca

El siguiente test comprobará que `/` responde y que tiene una salida de `{ "hi": "world" }`

>Reemplazar el contenido del fichero por el siguiente código.

##### `api.test.js`
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

Decirle a la aplicación que vas a usar Mocha para testear

##### `package.json`

```javascript
 "scripts": {
   "start": "node index.js",
   "test": "mocha"
 },
```

## HEROKU

Es el servidor de pruebas elegido
Puede visitar : [Heroku para node](https://devcenter.heroku.com/categories/nodejs-support)

#### Preparar la subida a heroku

Se hace la condición a PORT para que sepa si llama desde el servidor `process.env.PORT` o desde el puerto `5000` que hemos definido para localhost.

>Reemplazar el contenido del fichero por el siguiente código.

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