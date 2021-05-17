![page-flipper](img/repo-banner.png)

[![Latest Release](https://img.shields.io/github/v/release/Ubunfu/page-flipper)](https://github.com/Ubunfu/page-flipper/releases)
[![codecov](https://codecov.io/gh/Ubunfu/page-flipper/branch/master/graph/badge.svg?token=D2SOLR1VOK)](https://codecov.io/gh/Ubunfu/page-flipper)
[![CircleCI](https://img.shields.io/circleci/build/github/Ubunfu/page-flipper?logo=circleci)](https://app.circleci.com/pipelines/github/Ubunfu/page-flipper)
![Contrubutors](https://img.shields.io/github/contributors/Ubunfu/page-flipper?color=blue)
![Last Commit](https://img.shields.io/github/last-commit/Ubunfu/page-flipper)

Page Flipper is a place dedicated to enjoying your favorite books together with friends. 
Plan club meetings, propose book selections, vote on candidates, and leave your thoughts 
with ratings and reviews.

## Architecture
Page-Flipper is a NodeJS app, using ExpressJS as a back-end and Handlebars as a templating
engine to help render pages from the back-end.  

A pooled connection to a Postgres DB is leveraged for a back-end data store.

Session management is powered by the `express-session` Express middleware.  The type of 
back-end store to use for session data is configurable via the `SESSION_STORE_PROVIDER` 
configuration.

Passwords are securely hashed prior to being stored per 
[OWASP recommendations](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
At time of writing, this entails the following Argon2id minimum configuration:
* 15MB memory
* Iteration count of 2
* 1 degree or parallelism

Builds run on Circle CI.

## Configuration
* `AWS_IAM_ROLE_NAME`: If deploying this service to AWS using the Serverless 
  framework, provide the name of an IAM role defining the service's permissions. If
  `SESSION_STORE_PROVIDER=DYNAMODB`, this role should provide read/write access to
  the table.
  * Type: `string`
  * Default: n/a
* `DB_CONNECT_STRING`: Connection string to the database
  * Type: `string`
  * Default: n/a
  * Example: `postgresql://postgres:password@localhost:5432/postgres`
* `DOMAIN`: Domain to register in front of the site
  * Type: `string`
  * Default: n/a
* `LISTEN`: Flag to trigger calling `app.listen()` to start up the server.
  * Type: `boolean`
  * Default: n/a
* `LISTEN_PORT`: Port the server will listen on, if `LISTEN=true`
  * Type: `number`
  * Default: n/a
* `REDIS_CONNECT_STRING`: If `SESSION_STORE_PROVIDER=REDIS`, then supply a connection 
  string for Redis.  [More info here](https://www.npmjs.com/package/redis).
  * Type: `string`
  * Default: n/a
  * Example: `rediss://redis:password@redis:6379/0`
* `SESSION_EXP_MS`: The life-span of a new access token in milliseconds.
  * Type: `number`
  * Default: n/a
* `SESSION_SECRET`: The symmetric secret used to sign JWT access tokens
  * Type: `string`
  * Default: n/a
* `SESSION_STORE_DYNAMODB_HASH_KEY`: If `SESSION_STORE_PROVIDER=DYNAMODB`, then supply the name
  of the hash key for the DynamoDB table that will be used to store session data.
  * Type: `string`
  * Default: n/a
* `SESSION_STORE_DYNAMODB_TABLE`: If `SESSION_STORE_PROVIDER=DYNAMODB`, then supply the name
  of the DynamoDB table that will be used to store session data.
  * Type: `string`
  * Default: n/a
* `SESSION_STORE_PROVIDER`: The type of back-end store to be used for session information. 
  * Type: `string`
  * Default: `IN-MEMORY`
  * Options: [`IN-MEMORY`, `REDIS`, `DYNAMODB`]