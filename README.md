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

You will also need to set the bot up in the Discord Developer Portal. The bot
needs access  to at least the "Server Members Intent" and "Presence Intent".  
See [here](https://github.com/pyamsoft/mousewatch/issues/9) for more details.

# Running
```bash
$ yarn start

OR

$ ./bin/dockerize
```

# Usage

In any channel the bot is present in, type `<PREFIX>`
followed by the date you wish to check for availability

```
 <In #general>

 me >  !mouse show 01/24/2023

 bot > Tue, Jan 24, 2023: Inspire Key reservations are AVAILABLE
       https://disneyland.disney.go.com/entry-reservation/

 me >  !mouse watch 01/04/2021

 bot > :thumbsup: Watching Inspire Key reservations on Sun, Dec 18, 2022
 
 * A few minutes later... *
 
 bot > @You Sun, Dec 18, 2022: Inspire Key reservations are AVAILABLE
       https://disneyland.disney.go.com/entry-reservation/
       
       (React to this message with an emoji to stop watching, otherwise I
        will assume you did not get a reservation spot, and will keep watching.)

```

## Customization

You can have the bot only watch and reply in a designated channel by providing the
`BOT_CHANNEL_ID` variable in the `.env` file, otherwise the bot will watch and reply from
all channels.

The bot will always watch and reply in individual DMs.

## Quirks

DLA reservation website is intentionally, sneakily, broken

tl;dr - not logged in the calendar is a complete lie from the webpage (the robot is more legit),
and logged in you must be on a specific page for the calendar to refresh for real.

when you are checking the MK calendar if you are not logged in, the days are different from when you are logged in.

if you are not logged in, the calendar fetches dates randomly, anywhere between once a minute and once an hour.

if you are logged in, you MUST refresh the page from this [URL](https://disneyland.disney.go.com/entry-reservation/)

if you do not go from this page and click the button, the website does not actually ask the calendar for new
reservation data, it will instead feed you saved data. No matter who you try to check or uncheck in your party,
it doesn't matter. You must return to that starting page URL and click the button or the calendar won't refresh.

happy reserving.


## License

Apache 2

```
Copyright 2023 pyamsoft

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

