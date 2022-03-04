const { MessageEmbed } = require('discord.js');

// Init
const Lol = require('node-riotapi/dist/api/lol').default;
const { RIOT_API_KEY } = require("../../data/config.json");
var lol = new Lol({ apiKey: RIOT_API_KEY, region: 'kr' });

// Get LOL stats
async function execute() {
    const summonerInfo = await lol.getSummonerByName('대덕sw마이스터고');
    console.log(summonerInfo);
}

// export
module.exports = {
    name: 'sum',
    description: "**Summoner** LOL",
    execute
}