require('dotenv').config();
const { MessageEmbed } = require('discord.js');

// Init
const Lol = require('node-riotapi/dist/api/lol').default;
var lol = new Lol({ apiKey: process.env.RIOT_API_KEY, region: 'kr' });

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