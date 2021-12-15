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

GPLv2

```

  The GPLv2 License

    Copyright (C) 2021 Peter Kenji Yamanaka

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

```
