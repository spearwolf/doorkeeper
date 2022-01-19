# doorkeeper

A simple and unobtrusive token management service.

This is a [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) web service, written in javascript and built on top of [Node.js](https://nodejs.org/)

As token database backend an internal _in memory store_ (development) can be used or alternatively a [redis](https://redis.io/) store (production).

This micro service is intended as a starting point for the development of distributed web apps/services that need token-based verification. the architecture is designed in such a way that further required code logic can be easily inserted in many places.


## Table of Contents

1. [Table of Contents](#table-of-contents)
2. [How it works](#how-it-works)
   1. [Login via password](#login-via-password)
   2. [Create session token](#create-session-token)
3. [Service Endpoints](#service-endpoints)
   1. [Create Token _aka_ LOGIN](#create-token-aka-login)
   2. [Verify Token](#verify-token)
   3. [Destroy All Tokens](#destroy-all-tokens)
4. [Development](#development)
   1. [Setup](#setup)
   2. [Testing](#testing)
   3. [Run a local server](#run-a-local-server)
   4. [Build docker image](#build-docker-image)


## How it works

The _doorkeeper_ service knows two different types of tokens: The **login token** can be generated using a valid _login id_ and a _password_. A login token can then be used to generate a **session token**. Such a session token can be used to authenticate api calls to your other web app/services.

Both tokens have a limited lifetime (expiration). While the session token is usually only valid for a short time (1 hour) the login token is different, it could be valid for much longer (e.g. 6 months), but expires after 7 days if the login token is not used to generate session tokens.

> NOTE: all timeouts mentioned are of course customizable

In order to generate a login token, the doorkeeper service must rely on a (possibly external) user provider and on the store (a redis database).

When generating a session token based on a login token, the content of the login token is trusted and it is therefore no longer necessary to ask the (possibly) external user provider for it, but the store is still accessed (of course only login tokens issued by the service itself are trusted)

> NOTE: The current implementation of the doorkeeper service uses a simple `users.json` file as user database (at this point the developer is encouraged to add more enhanced user providers and extended login-is-valid verifications :wink:)

### Login via Password

![Login via password](./docs/login-via-password.mmd.svg)

### Create Session Token

![Create session token](./docs/create-session-token.mmd.svg)


## Service Endpoints

---

### Create LOGIN Token _aka_ Login via Password

```
POST /token
```

| parameter | type | in | description |
|-----------|------|----|-------------|
| `login` | string | body | login id |
| `password` | string | body | login secret |

Create a new token. You will need to send the `login` and `password` parameters.
The service will accept the parameters only as _form_ or _json_ encoded body data.

Returns a _signed_ [jwt token](https://jwt.io/).

---

### Verify Token

```
GET /token
```

Verify and return the token payload as json.

You need to pass your token as header parameter: `Authorization: Bearer XYZ123`.

| parameter | type | in | description |
|-----------|------|----|-------------|
| `Authorization` | string | header | jwt token |

Returns the token payload data as *json* object. Returns with an error (`400 Bad Request`) if the token can not be verified.

---

### Destroy All Tokens

```
DELETE /tokens
```

Destroy all tokens.

You need to pass your token as header parameter: `Authorization: Bearer xyz123`.

| parameter | type | in | description |
|-----------|------|----|-------------|
| `Authorization` | string | header | jwt token |

> :warning: SECURITY NOTE: for this api call the `admin` role must be present in the token data props under the `roles` key!

---

## Development

### Setup

As a prerequisite, you need a **node v16+** and a current **docker** environment installed.

```sh
$ npm install
```

### Testing

Run `npm test` for running all tests from [test/*](test) against the local in-memory database.

Using `npm run test:redis:run` will use *docker-compose* to run all tests against a dockerized redis instance.

Or just use `npm run test:all` to run all tests against both environments (intended for ci).

For development `npm run test:watch` is meant, which _only_ test against the in-memory database, but restarts the tests every time the sources have changed. very useful for development 😉

> :point_right: NOTE: at the moment we use _mocha_ as test runner and not _jest_ because _jest_ support for native es6 imports is still experimental AND _jest_ runs incredibly slow in a docker context 😢

### Run a local server

In order to run a local server, you need to start a redis instance:

```sh
$ npm run dev:redis:up
```

After that, you can start a local server with:

```sh
$ npm start
# .. or use:
$ npm run watch
```

This will start a server listening on http://localhost:6100 and restart the application when a source file changed.

> for the very lazy `npm run dev` is meant ... this starts both a redis instance and then immediately the server in watch mode


### Build docker image

To create a release version and build the docker image, simply run:

```sh
$ npm run docker:build
```

Start the docker container with `npm run docker:run` (or use `docker:start` which starts the doorkeeper service in the background) or run an interactive shell session via `npm run docker:run:shell`



have fun 🚀
