# Discord DLR Magic Key Calendar watcher

Watches the Magic key endpoint for availability

# Install

This is not currently a public bot, you need
to make your own Discord App in the developer portal,
and then pass your own bot tokens into `.env`
along with a `prefix` (I use `!mouse`)

See the `env.default` file for the expected format.

# Running
```
$ node ./index.js
```

# Usage

In any channel the bot is present in, type `<PREFIX>`
followed by the date you wish to check for availability

```
 <In #general>

 me >  !mouse show 01/04/2021

 bot > Spots are AVAILABLE on Jan 4, 2022. https://disneyland.disney.go.com/passes/blockout-dates/

 me >  !mouse watch 01/04/2021

 bot > :thumbsup:
 * A few minutes later... *
 bot > Spots are AVAILABLE on Jan 4, 2022. https://disneyland.disney.go.com/passes/blockout-dates/

```
