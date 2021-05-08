# Page Flipper
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

## Configuration
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
* `SESSION_EXP_MS`: The life-span of a new access token in milliseconds.
  * Type: `number`
  * Default: n/a
* `SESSION_SECRET`: The symmetric secret used to sign JWT access tokens
  * Type: `string`
  * Default: n/a
* `SESSION_STORE_PROVIDER`: The type of back-end store to be used for session information. 
  * Type: `string`
  * Default: `IN-MEMORY`
  * Options: [`IN-MEMORY`, `REDIS`]
* `REDIS_CONNECT_STRING`: If `SESSION_STORE_PROVIDER=REDIS`, then supply a connection 
  string for Redis.  [More info here](https://www.npmjs.com/package/redis).
  * Type: `string`
  * Default: n/a
  * Example: `rediss://redis:password@redis:6379/0`