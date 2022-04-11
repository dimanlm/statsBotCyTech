const lol = require('../../api_methods/lol/default');
var help = require('../support/help');


async function execute(message, args) {
    let username = args[0]
    if (username == undefined) {
        help.execute(message);
        await message.reply("Something is wrong with your command. Please try again.");
        return;
    }

    const player = await lol.summoner(username);
    if (player == null) {
        await message.reply("Player not found");
        return;
    }

    await message.reply("Found a player");

}

// export
module.exports = {
    name: 'sum',
    description: "**Summoner** LOL",
    execute
}