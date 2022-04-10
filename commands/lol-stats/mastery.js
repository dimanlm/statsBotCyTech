const lol = require('../../api_methods/lol/default');
var help = require('../support/help');

async function execute(message,args) {

    let username = args[0]
    if (username == undefined) {
        help.execute(message);
        await message.reply("Something is wrong with your command. Please try again.");
        return;
    }
    const ma = await lol.mastery(username);

    await message.reply({embeds:[ma]});

}

// export
module.exports = {
    name: 'mastery',
    description: "**Summoner** LOL",
    execute
}