const fs = require('fs');
const { TOKEN } = require("./data/config.json");
const { Client, Intents, Collection } = require('discord.js');
const prefix = require("./data/prefix.json")
const db = require('quick.db')

const botClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

/************************************** */



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
    };
};

 /************************************** */

botClient.on('ready', () => {
    console.log(`Logged in!`);
    botClient.user.setActivity('Casual | $help', { type: 'PLAYING' }); // set a Status 
});


botClient.on('messageCreate', function(msg) {

    if (msg.author.bot || !msg.content.startsWith(prefix)) return;
  
    const args = msg.content.slice(prefix.length).split(' ');
    const command = args.shift();

    // check if the command is in the database (so it is a custom command)
    let customCommands = db.get(`cmd_${msg.guild.id}`)
    if(customCommands) {
        let cmdy = customCommands.find(x => x.name === command)
        if(cmdy) msg.reply(cmdy.response)
    }

    // check if the command is in  /commands
    if (!botClient.commandsCollection.has(command)) return;

    try {
        botClient.commandsCollection.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('There was an error trying to execute that command!');
    }
});

botClient.login(TOKEN);
