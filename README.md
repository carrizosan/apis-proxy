# APIS-PROXY

Proxy server to handle requests to destination API by limiting the consume depending on the origin IP, the destination path, or both. It provides high scalability architechture by providing docker images support for instances replication, and a high performant external cache service like Redis to share the requests information between nodes.

All the request information are stored asynchronously in MongoDb, it means that the request is not delayed by the insert operation, and the response do not depends on the success or failure of this operation. MongoDb also provides high availability and auto scaling options in cloud providers, and give us flexibility to retrieve statistics, logs or any metrics.

## Installation

```
cd apis-proxy
npm install
```

## Config

Create a .env file in the root.
You can find an example in the _/docs_ folder.

- IP_RATE_LIMIT_WINDOW_MINUTES: define the period of time where IP's count are stored and refresh the limit.
- IP_RATE_LIMIT_MAX_REQUESTS: request allowed by "window", by IP.
- PATH_RATE_LIMIT_WINDOW_MINUTES: define the period of time where paths count are stored and refresh the limit.
- PATH_RATE_LIMIT_MAX_REQUESTS: request allowed by "window", by path.
- IP_PATH_RATE_LIMIT_WINDOW_MINUTES: define the period of time where the combination of IP and paths count are stored and refresh the limit.
- IP_PATH_RATE_LIMIT_MAX_REQUESTS: request allowed by "window", by IP and path combination.
- DESTINATION_API: the destination of the proxy.
- PORT: server port.
- REDIS_HOST: connection URI for redis service.
- MONGO_DB_URI: connection URI for mongodb service.

## Running the app

### Set Up

1. You can use docker to set up both redis and mongodb running the following command:
   `docker compose up -d`
   Ensure you have the docker service running.
2. If you prefer, you can install by yourself redis and mongodb services, and configure the local uri and port in the .env file.
3. If you have a cloud instance running, like Mongo Atlas or AWS ElastiCache service, you can configure the connection URLs in the .env file.

### Run

Is recommend use the specified NodeJS version. If you are using nvm you can run
`nvm use`
to install and use the recommended version.

Run `npm start` or `npm run start:dev` (for watch mode, only version > 18).

## Services

The server exposes some statistics endpoints and a swagger documentation:

- `GET /statistics/lasts`: Get last requests with filtering options.
- `GET /statistics/most-requested`: Get most requested paths.
- `GET /statistics/by-date`: Get requests between two dates.
- `GET /api-docs`: Get swagger documentation (UI in browser).

Services are documented in swagger path. Also you can download the `swagger.json` from the `/docs` folder and import it in Postman.

## To do

- Logger implementation
- Return the right rate limit headers when using multiple limiters
- Testing for limiters

## Contribution

If you find an error, you have a suggestion or you want to contribute, feel free to open a PR 😊

--- Created by [Santiago Carrizo](https://github.com/carrizosan)
