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
            champions_list.push([champ[j].name, champ[j].title]);
        }

        var embedMsg = new MessageEmbed();

        embedMsg
            .setColor('GREEN')
            .setDescription("List of free champions for this week !")
        
        for (let i in champions_list) {
            embedMsg.addField(champions_list[i][0], champions_list[i][1]);
        }

        return embedMsg;
    },

    mastery: async function(username) {
        const summonerInfo = await lol.getSummonerByName(username);
        var summonerMastery = await lol.getChampionMasteriesBySummoner(summonerInfo.id);
        summonerMastery = (summonerMastery.slice(0,5));
        var mast = [];
        var name = [];
        var image = [];
        for (j in summonerMastery){
            var i=0;
            while(champ[i].key != summonerMastery[j].championId) {
                i++;
            }
            name[j] = champ[i].name;
            image[j] = champ[i].icon;
            mast[j] = summonerMastery[j].championPoints;
            console.log(image[0])
        }
        
        var embedMsg = new MessageEmbed();

        embedMsg
            .setColor('BLUE')
            .setImage(image[0])
            .setDescription("Number of mastery points of "+ summonerInfo.name + " 5 most played champions ! ")
        
        for (let i = 0; i<=4; i++) {
            embedMsg.addField(name[i], mast[i].toString());
        }
        console.log(summonerInfo);
        return embedMsg;
        
    }
}
