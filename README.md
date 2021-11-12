# Discord DLR Magic Key Calendar watcher

Watches the Magic key endpoint for availability

# Install

This is not currently a public bot, you need
to make your own Discord App in the developer portal,
and then pass your own bot tokens into `.env`
along with a `prefix` (I use `$`)

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

 me >  !mouse 11/12/2021

 bot > Availability on November 12, 2021
         Disneyland: Available
         California Adventue: Blocked

```
