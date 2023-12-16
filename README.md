# Discord bot

Discord bot for personal use, hosted on GCP.

## Requires

Node v16

Yarn 1.*

## Running locally

In order for you to test this locally, you need to create a file in the root direct called `.env`

In this file, create an entry with the token for your discord bot

```
DISCORD_BOT_TOKEN=<your token here>
```

### Optional

If you want to run stock quotes, you need an api key from <https://www.alphavantage.co/>
Add an entry in `.env`

```
STOCK_API_KEY=<your key here>
```

More info can be found at: <https://discordjs.guide/preparations/setting-up-a-bot-application.html>

Once this is setup, and you've added a copy of your bot to a server, run the commands

```bash
yarn install
yarn start:dev
```

## Deploying

Deployment is automatically pushed to Google Cloud on merge to main branch.
