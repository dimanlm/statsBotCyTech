const fs = require('fs');
require('dotenv').config();

const { Client, Intents, Collection } = require('discord.js');
const mongoose = require('mongoose');
const raygun = require('raygun');

const prefix = require("./config/prefix.json");
const customCmdModel = require('./models/customCmdSchema');

const http = require('http');
const port = process.env.PORT || 3030;
const hostname = process.env.HOST || 'localhost';

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.writeHead(301, { "Location": "https://discord.com/api/oauth2/authorize?client_id=956548947600605215&permissions=8&scope=bot" });
    res.end();
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

/************************************** */

const raygunClient = new raygun.Client().init({
    apiKey: process.env.RAYGUN_TOKEN,
    reportUncaughtExceptions: true,
    batch: true
});

/************************************** */

const botClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

botClient.commandsCollection = new Collection();

const cmdDirs = fs.readdirSync('./commands');

/* Loop through subdirectories in commands directory */
for (let dir of cmdDirs) {
    /* Read every subdirectory and filter for JS files */
    let commandFiles = fs.readdirSync(`./commands/${dir}`)
    .filter(f => f.endsWith('.js'));

    /* Loop through every file */
    for (let file of commandFiles) {
        /* Set command file */
        let command = require(`./commands/${dir}/${file}`);
        botClient.commandsCollection.set(command.name, command);
    }
}

 /************************************** */

botClient.on('ready', async () => {
    console.log(`Logged in!`);
    botClient.user.setActivity('Casual | $help', { type: 'PLAYING' }); // set a Status 
    // connect to our database
    await mongoose.connect(process.env.URI, {
        keepAlive: true
    }).then(()=>{
        console.log('Connected to the DB')
    }).catch(err => console.log(err));
});


botClient.on('messageCreate', async function(msg) {

    if (msg.author.bot || !msg.content.startsWith(prefix)) return;
  
    const args = msg.content.slice(prefix.length).split(' ');
    const command = args.shift();

    // check if the command is in the database (so it is a custom command)
    let customCommands = await customCmdModel.findOne({ guildId: msg.guild.id, cmdName: command.toLowerCase() });
    if (customCommands) return msg.reply(customCommands.response)

    // check if the command is in  /commands
    if (!botClient.commandsCollection.has(command)) return;

    try {
        botClient.commandsCollection.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('There was an error trying to execute that command!');
    }
});

botClient.login(process.env.TOKEN);
