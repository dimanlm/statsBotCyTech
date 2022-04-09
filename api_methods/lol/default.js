require('dotenv').config();
const { MessageEmbed } = require('discord.js');

let Lol = require('node-riotapi/dist/api/lol').default;
let LeagueAPI = require('leagueapiwrapper');

const champ = require('./champions.json');

////////////////////////////////////////////////////////////////

LeagueAPI = new LeagueAPI(process.env.RIOT_API_KEY, Region.EUW);
var lol = new Lol({ apiKey: process.env.RIOT_API_KEY, region: 'euw1' });


module.exports = {
    // Get LOL stats
    summoner: async function (username) {
        try{
            return (await LeagueAPI.getSummonerByName(username));
        }catch(e){
            console.log(e);
            return null;
        }
    },

    // Get champions
    champions: async function () {
        const rota = (await lol.getChampionRotations()).freeChampionIds;
        var champions_list = [];
        for (let i in rota) {
            var r = rota[i];
            var j=0;
            while(champ[j].key != r) {
                j++;
            }
            champions_list.push([champ[j].id, champ[j].icon]);
        }

        var embedMsg = new MessageEmbed();

        embedMsg
            .setColor('GREEN')
            .setDescription("List of free champions")
        
        for (let i in champions_list) {
            embedMsg.addField(champions_list[i][0], champions_list[i][1]);
        }

        return embedMsg;
    }
}
