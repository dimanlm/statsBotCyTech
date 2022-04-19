
# Stats Bot
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/dimanlm/statsBotCyTech/build)
![GitHub issues](https://img.shields.io/github/issues/dimanlm/statsBotCyTech)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dimanlm_statsBotCyTech&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dimanlm_statsBotCyTech)

[<img alt="alt_text" width="150px" src="https://tabstats.com/images/tab/discordbot.png" />](https://discord.com/api/oauth2/authorize?client_id=956548947600605215&permissions=8&scope=bot)


Project built on DiscordJS v13 with Node.js 16.
The bot retrieves and displays stats from variety of games in your server. For now there are only stats for Rainbow Six Siege (thanks to [**r6api.js**](https://www.npmjs.com/package/r6api.js) package and Ubisoft's public API) and League of Legends (thanks to RIOT API).

There are a variety of commands, you can use **$help** to see all of them.

# Installation
```
npm install
```

# Usage
Firstly, you need to create a **.env** in the root of the project and insert there all needed environment variables: 
- **statsBotCyTech/.env**

The file must have those variables:

```
TOKEN=YOUR-DISCORD-BOT-TOKEN
URI=mongodb+srv:YOUR-MONGODB-SRV

RIOT_API_KEY=YOUR-RIOT-API-KEY
UBI_MAIL=YOUR-UBISOFT-ACC-EMAIL
UBI_PASSWORD=YOUR-UBISOFT-ACC-PASSWD
```
#### Environment values
- *TOKEN*: you need to create a Discord aplication in the Developer Portal. [**Check the documentation**](https://discord.com/developers/docs/intro#bots-and-apps)
- *URI*: a connection string to your MongoDB database, so you can create, modify and delete custom commands on your server.
- *Ubisoft credentials*: used to connect to Ubisoft's API. You can create your account [**here**](https://account.ubisoft.com/en-US/login)


You also have the posibility to modify the file with default values for the R6 API:

- **statsBotCyTech/src/config/default.json**

```
{
    "PLATFORM" : "uplay",
    "REGION": "emea",
    "TOTAL_NUMBER_OF_SEASONS": 25
}
```
#### Default data values
- PLATFORM: "uplay", "psn" or "xbl"
- REGION: "emea", "ncsa" or "apac"
- TOTAL_NUMBER_OF_SEASONS: has to be an integer. At this moment, the total is 25 seasons.

_Note : As default REGION, you can just leave ***emea***, because Ubisoft made ranks global._

# Launch the bot
Once you set the environment variables, you can launch the bot:
```
node index.js
```

___

# Rainbow Six Tracker
### Commands
Seasonal RANKED Summary:

    $r6 [nickname]

Seasonal RANKED stats (more informative):
    
    $ranked [nickname]

Seasonal CASUAL stats:
    
    $casual [nickname]

OVERALL R6S stats:
    
    $general [nickname]


### Examples

    $r6 Shaiiko.BDS
    $general ThinkinNade.SSG
    $casual SHA77ELELE
![alt text][logo]

[logo]: https://i.imgur.com/3oNDZhn.png

___

# League of Legends Tracker
### Commands
List of free champions for this week:

    $champs

Mastery points of TOP 5 most played champions:
    
    $mastery [nickname]

Summoner:
    
    $sum [nickname]

*More commands will be added soon*.


### Examples

    $r6 Shaiiko.BDS
    $general ThinkinNade.SSG
    $casual SHA77ELELE
![alt text][logo1]

[logo1]: https://i.imgur.com/EkBJ8d1.png
