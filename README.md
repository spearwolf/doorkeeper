# doorkeeper

The doorkeeper is the web service which is responsible
for login and token management used by other kiwoticum applications.

This is a [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) web service, written in javascript and built on top of [Node.js](https://nodejs.org/)


## Table of Contents

1. [Table of Contents](#table-of-contents)
2. [Service Endpoints](#service-endpoints)
   1. [Create Token](#create-token)
   2. [Verify Token](#verify-token)
   3. [Get Public Token Key](#get-public-token-key)
   4. [Destroy All Tokens](#destroy-all-tokens)
3. [Development Environment](#development-environment)
   1. [Setup](#setup)
   2. [Run local server](#run-local-server)
   3. [Build docker image](#build-docker-image)


## Service Endpoints

### Create Token

```
POST /token
```

| parameter | description |
|-----------|-------------|
| `login` | login id |
| `password` | login secret |

Create a new token. You will need to send the `login` and `password` parameters.
The service will accept the parameters only as _form_ or _json_ encoded body data.

Returns a _signed_ [jwt token](https://jwt.io/).


### Verify Token

```
GET /token
```

Verify and return the token payload as json.
You need to pass your token as header parameter: `Authorization: Bearer XYZ123`.
Returns the token payload data as *json* object. Returns with an error (`400 Bad Request`) if the token can not be verified.


### Get Public Token Key

```
GET /token/public.pem
```

Get the public key which is needed if you want to verify the signed token by yourself.


### Destroy All Tokens

```
DELETE /tokens
```

Destroy all tokens.

You need to pass your token as header parameter: `Authorization: Bearer xyz123`.


## Development Environment

### Setup

As a prerequisite, you need a **node v16+** and a current **docker** environment installed.

```sh
$ npm install
```


### Run local server

In order to run a local server, you need to start a redis instance:

```sh
$ docker-compose up redis
```

After that, you can start a local server with:

```sh
$ npm run watch
```

This will start a server listening on http://localhost:6100 and restart the application when `src/` files changed.


### Build docker image

To create a release version and build the docker image, simply run:

```sh
$ npm run build:docker
```

Start a docker container with `npm run docker` or run an interactive shell session via `npm run docker:sh`
