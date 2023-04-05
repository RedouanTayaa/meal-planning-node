<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Description

<p>The meal planner is used to do the shopping and avoid wasting food and not using paper to do it</p>
<p>The API is based on [Nest](https://github.com/nestjs/nest) framework TypeScript.</p>
<p>The front is based on [Ionic](https://github.com/ionic-team/ionic-framework) and [Angular](https://github.com/angular/angular) framework TypeScript.</p>

## Installation and running app with Docker

```bash
$ docker-compose up -d --build
In API container
$ npm run migration:up
```

## Installation without Docker

```bash
For api and front
$ npm install
Just for API
$ npm run migration:up
```

## Running the app without Docker

```bash
# development (API and front)
$ npm run start

# watch mode (API)
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
