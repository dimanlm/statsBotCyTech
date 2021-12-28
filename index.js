const fs = require('fs');
const { TOKEN } = require("./data/config.json");
const { Client, Intents, Collection } = require('discord.js');

const botClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = '!'
 /************************************** */

botClient.commandsCollection = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const requestedCommand = require(`./commands/${file}`);
	botClient.commandsCollection.set(requestedCommand.name, requestedCommand);
}

 /************************************** */

botClient.on('ready', () => {
    console.log(`Logged in!`);
    botClient.user.setActivity('Rainbow Six Siege', { type: 'WATCHING' }); // set a Status 
});


botClient.on('message', function(msg) {

    if (msg.author.bot || !msg.content.startsWith(prefix)) return;
  
    const args = msg.content.slice(prefix.length).split(' ');
    const command = args.shift();

    if (!botClient.commandsCollection.has(command)) return;

    try {
        botClient.commandsCollection.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('There was an error trying to execute that command!');
    }
});

botClient.login(TOKEN);
