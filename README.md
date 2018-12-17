# Proyecto de invitaciones

### Tecnologías

* [nmarkdown-it] - Lenguaje de marcado para documentar.
* [Node.js ](https://nodejs.org/es/) | v 11.3.0 Entorno de ejecución para javascript, 
* [Mocha](https://www.npmjs.com/package/mocha) | v 6.4.1 Framework de test para node
* [Express](https://www.npmjs.com/package/express) | v 6.4.1 framework para cosntruir apps node.js  [@tjholowaychuk]
* [Docker](https://www.docker.com/) | v 11.3.0 automatiza el despliegue de aplicaciones dentro de contenedores de software

### Instalación
Se requiere [Docker](https://www.docker.com/) 18+ para funcionar.

Para entornos de desarrollo...

##### Iniciar NPM
```sh
$ cd invitationes
$ npm install -d
```
##### Generar el contenedor
La primera vez y cada vez que se realize un cambio hay que reconstruir el contenedor, el sudo dependerá de la configuración del ordenador.

```sh
$ sudo docker build -t invitations .
```
##### Arrancar la aplicación
```sh
$ sudo docker run invitations
```

Visualización en local http://localhost:5000/

##### Iniciar sin Docker
```sh
$ node index.js
```

##### Arrancar test
```sh
$ npm mocha
```