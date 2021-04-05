# Page Flipper
Page Flipper is a place dedicated to enjoying your favorite books together with friends. Plan club meetings, propose book selections, vote on candidates, and leave your thoughts with ratings and reviews.

## Configuration
* `LISTEN`: Flag to trigger calling `app.listen()` to start up the server.
  * Type: `boolean`
  * Default: n/a
* `LISTEN_PORT`: Port the server will listen on, if `LISTEN=true`
  * Type: `number`
  * Default: n/a
* `SESSION_SECRET`: The symmetric secret used to sign JWT access tokens
  * Type: `string`
  * Default: n/a
* `SESSION_EXP_MS`: The life-span of a new access token in milliseconds.
  * Type: `number`
  * Default: n/a
* `DOMAIN`: Domain to register in front of the site
  * Type: `string`
  * Default: n/a
* `TABLE_USERS`: The DynamoDB table name to use for storing user data
  * Type: `string`
  * Default: Name of the table created by the Serverless framework
* `TABLE_USERS_REGION`: AWS region of the `TABLE_USERS` DynamoDB table
  * Type: `string`
  * Default: Region of the table created by the Serverless framework
* `TABLE_CLUBS`: The DynamoDB table name to use for storing club data
  * Type: `string`
  * Default: Name of the table created by the Serverless framework