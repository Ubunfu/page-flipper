# Page Flipper
Page Flipper is a place dedicated to enjoying your favorite books together with friends. Plan club meetings, propose book selections, vote on candidates, and leave your thoughts with ratings and reviews.

## Configuration
* `LISTEN`: Boolean flag to trigger calling `app.listen()` to start up the server.
  * `true | false`
* `LISTEN_PORT`: Port the server will listen on, if `LISTEN=true`
  * `number`
* `SESSION_SECRET`: The symmetric secret used to sign JWT access tokens
  * `string`
* `SESSION_EXP_MS`: The life-span of a new access token in milliseconds.
  * `number`