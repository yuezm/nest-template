## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod
```

## Build
```bash
# build app
$ npm run build

# build docker
$ npm run build:docker

# build proto buffer
$ npm run build:protocol

# pm2 
$ npm run startup/stop/restart

# pm2 in docker
$ npm run startup:docker
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

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).
  
  
### 各个其他包，按需要加载或删除
#### 微服务包
```bash
npm i --save @nestjs/microservices
```
#### swagger包
```bash
npm install --save @nestjs/swagger swagger-ui-express
```

