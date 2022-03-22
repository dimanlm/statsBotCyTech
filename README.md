
# Stats Bot
[![build](https://github.com/dimanlm/statsBotCyTech/actions/workflows/node.js.yml/badge.svg)](https://github.com/dimanlm/statsBotCyTech/actions/workflows/node.js.yml)

Project built on DiscordJS v13 with Node.js 16.
The bot retrieves and displays Rainbow Six Siege stats in your server, thanks to [**r6api.js**](https://www.npmjs.com/package/r6api.js) package and Ubisoft's public API. You can only track players who play on PC.

There are a variety of commands, you can use **$help** to see all of them.

# Installation
```
npm install
```

# Usage
Firstly, you need to create a **.env** in the root of the project and insert there all needed environment variables: 
- **nlmbot-public/.env**

The file must have those variables:

```
TOKEN = YOUR-DISCORD-BOT-TOKEN
URI = mongodb+srv:YOUR-MONGODB-SRV

UBI_MAIL = "YOUR-UBISOFT-ACC-EMAIL"
UBI_PASSWORD = "YOUR-UBISOFT-ACC-PASSWD"
```
#### Environment values
- *TOKEN*: you need to create a Discord aplication in the Developer Portal. [**Check the documentation**](https://discord.com/developers/docs/intro#bots-and-apps)
- *URI*: a connection string to your MongoDB database, so you can create, modify and delete custom commands on your server.
- *Ubisoft credentials*: used to connect to Ubisoft's API. You can create your account [**here**](https://account.ubisoft.com/en-US/login)


You also have the posibility to modify the file with default values for the R6 API:

- **nlmbot-public/config/default.json**

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

# Launch
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

