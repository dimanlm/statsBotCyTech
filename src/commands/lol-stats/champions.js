const lol = require('../../api_methods/lol/default');

async function execute(message) {

    const champs = await lol.champions();

    message.reply({embeds:[champs]});

}


// export
module.exports = {
    name: 'champs',
    description: "**Summoner** LOL",
    execute
}