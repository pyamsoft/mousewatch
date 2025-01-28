# Discord DLR Magic Key Calendar watcher

Watches the Magic key endpoint for availability

This bot will never auto-book your reservation. The only goal is to automate watching
and refreshing the magic key calendar page.

# Install

This is not currently a public bot, you need
to make your own Discord App in the developer portal,
and then pass your own bot tokens into `.env`
along with a `prefix` (I use `!mouse`)

Copy the `env.default` file to `.env` to get started!

# Running

You will need to create a Bot in the
[Discord Developer Portal](https://discord.com/developers/applications/). At
a minimum, the bot must have a `TOKEN` and you must set the bot up with the
`Message Content` intent.

[![Intents](https://raw.githubusercontent.com/pyamsoft/mousewatch/main/art/intents.png)][1]

```bash
$ yarn start

OR

$ ./bin/dockerize
```

# Usage

In any channel the bot is present in, type `<PREFIX>`
followed by the date you wish to check for availability

[![Example Bot Command](https://raw.githubusercontent.com/pyamsoft/mousewatch/main/art/show.png)][2]

Calling the bot with the `show` command and a `<date>` formatted properly will make it show MK
availability for that given date.

You can call the bot with `watch` and a `<date>` formatted properly and it will constantly watch the
MK availability calendar for an opening on your given date. Upon seeing availability, the bot will @ reply
to you in the same channel or DM you originally started the `watch` command in. You can always `stop`
watching a specific `<date>`, or you can `cancel` all watched dates at any time.

For additional help and options, type the `<PREFIX>` and the bot will display all of its commands.

## Customization

You can have the bot only watch and reply in a designated channels by providing the
`BOT_TARGET_CHANNEL_IDS` variable in the `.env` file, otherwise the bot will watch and reply from
all channels. The `BOT_TARGET_CHANNEL_IDS` is a comma-seperated list of channel IDs.

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
Copyright 2024 pyamsoft

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

[1]: https://raw.githubusercontent.com/pyamsoft/mouswatch/main/art/intents.png
[2]: https://raw.githubusercontent.com/pyamsoft/mouswatch/main/art/show.png
