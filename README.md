# Discord DLR Magic Key Calendar watcher

Watches the Magic key endpoint for availability

This bot will never auto-book your reservation. The only goal is to automate watching
and refreshing the magic key calendar page.

# Install

This is not currently a public bot, you need
to make your own Discord App in the developer portal,
and then pass your own bot tokens into `.env`
along with a `prefix` (I use `!mouse`)

See the `env.default` file for the expected format.

# Prepare

You have the option of setting up a PostgresQL database which can store
bot data persistently. The author uses Heroku's free tier, and uses
the following commands to set up a database

```bash
$ heroku addons:create heroku-postgresql:hobby-dev
```

You must then insert the DATABASE_URL into your `.env` file.

# Running
```bash
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

## Quirks

Sometimes, randomly, the DLR availability endpoint will return inconsistent data as compared to the website.
This is odd, particularly given that we hit the same endpoint and many times will receive the same data back
from the API, but in busy periods the data source can give back wrong info. There is nothing that can be done
about this. As a result, the tool will sometimes state a day is blocked when it is actually open, or open when
it is actually blocked (though in practice, the first case has been observed more than once and the second case
has never been observed).

## License

Apache 2

```
Copyright 2021 Peter Kenji Yamanaka

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

