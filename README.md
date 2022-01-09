
# NLM Bot

Some commits and branches will be missing because the main development repository is private.

Project built on DiscordJS v13.
The bot retrieves and displays Rainbow Six Siege stats in your
server, thanks to [**r6api.js**](https://www.npmjs.com/package/r6api.js) package and Ubisoft's public API. You can only track players who play on PC.

There are a variety of commands, you can use **$help** to see all of them.

# Installation
```
npm install
```

# Launch
```
node index.js
```
or

```
nodemon index.js
```

# Usage
Firstly, you need to put your private Discord bot token in: 
- **nlmbot-public/data/config.json**. Also you need to provide your MongoDB URI to be able to use, add, modify, and delete your custom commands.

```
{
    "TOKEN": "YOUR-BOT-TOKEN",
    "URI": "mongodb+srv:YOUR-MONGODB-SRV"

}
```
Then, you need to complete the file with default data to set up the bot:

- **nlmbot-public/data/default.json**

```
{
    "YOUR_UBI_ACC_MAIL": "YOUR-UBI-ACC-EMAIL",
    "YOUR_UBI_ACC_PASSWORD": "YOUR-UBI-ACC-PASSWD",
    "PLATFORM" : "DEFAULT-PLATFORM",
    "REGION": "DEFAULT-REGION",
    "TOTAL_NUMBER_OF_SEASONS": 24
}
```

### Default data values
- PLATFORM: "uplay", "psn" or "xbl"
- REGION: "emea", "ncsa" or "apac"
- TOTAL_NUMBER_OF_SEASONS: has to be an integer. At this moment, the total is 24 seasons.

_Note : As default REGION, you can just write ***emea***, because Ubisoft made ranks global._

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
