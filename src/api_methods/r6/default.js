/** *** Here we use the default methods from r6api.js module *** **/

/** 
 * Init
*/
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

const R6API = require('r6api.js').default;
const { UBI_MAIL: email, UBI_PASSWORD: password } = process.env;
const r6api = new R6API({ email, password });

const { PLATFORM, REGION } = require("../../config/default.json");
const ubi = require("./ubiapi.js");

/**
 * Export functions
 */
module.exports = {
    
    /**
     * Function that allows us to find and verify if a uplay profile exists
     * @param {username} u 
     * @returns a promise of array containting profile info
     */
    findPlayer: async function (u){
        try{
            return (await r6api.findByUsername(PLATFORM, u));
        }catch(e){
            console.log(e);
            return;
        }
    },

    /************************************************** */
    /**
     * Function that allows us to get player's ranked summary for the current season
     * @param {array of player stats} p
     * @returns an embed message
     */
    getSeasonalRankedSummary: async function (p){
        var embedStatMsg = new MessageEmbed()

        let stats = await r6api.getRanks(PLATFORM, p.id, { regionIds: REGION, boardIds: 'pvp_ranked' });
        if (stats.length==0 ){
            embedStatMsg
                .setColor('RED')
                .setDescription("**" + p.username + "** does not have any stats")
            return(embedStatMsg);
        }
        let rankedStatsPath = stats[0].seasons[Object.keys(stats[0].seasons)].regions[REGION].boards.pvp_ranked;

        // when was the last data update
        var statsUpdateTime = Math.abs(new Date(rankedStatsPath.updateTime)-new Date())/1000/60;
        var statsUpdateMsg = "Updated " + (statsUpdateTime).toFixed(0) + " minute(s) ago"
        if (statsUpdateTime>59){ statsUpdateTime=statsUpdateTime/60; statsUpdateMsg = "Updated " + (statsUpdateTime).toFixed(0) + " hour(s) ago"}
        // create embed message with stats
        embedStatMsg
            .setColor(stats[0].seasons[Object.keys(stats[0].seasons)].seasonColor)
            .setTitle("Open full profile")
            .setURL('https://r6.tracker.network/profile/id/'+ p.id)
            .setAuthor(p.username, p.avatar['146'])
            .setDescription("**" + p.username + "'s** seasonal RANKED stats on **" + stats[0].seasons[Object.keys(stats[0].seasons)].seasonName + "**")
            .setThumbnail(rankedStatsPath.current.icon)
            .addFields(
                { name: '__Current Rank__', value: '>>> **'+rankedStatsPath.current.name +'**\n**MMR** '+rankedStatsPath.current.mmr + '\n**Last match **' + (rankedStatsPath.lastMatch.mmrChange<0?"":"+") + rankedStatsPath.lastMatch.mmrChange +'\n**Max MMR**: '+ rankedStatsPath.max.mmr, inline: true },
                { name: '__Pew Pew__', value: '>>> **KD:** ' + rankedStatsPath.kd + '\n**KM** ' + (rankedStatsPath.kills/rankedStatsPath.matches).toFixed(2) + '\n**Kills** ' + rankedStatsPath.kills + '\n**Deaths** ' + rankedStatsPath.deaths, inline: true },
                { name: '__Matches__', value: '>>> **WL **' + (rankedStatsPath.wins/rankedStatsPath.losses).toFixed(1) + '\n**Matches **' + rankedStatsPath.matches + '\n**Win ** ' +rankedStatsPath.wins + '\n**Loss **' + rankedStatsPath.losses + '\n**Abandon **' + rankedStatsPath.abandons, inline: true },
            )
            .setFooter(statsUpdateMsg)
        return(embedStatMsg);
    },

    /************************************************** */
    /**
     * 
     * @param {array of player stats} p 
     * @returns embed message with stats
     */
    getSeasonalRankedStats: async function (p){
        var embedStatMsg = new MessageEmbed()

        let stats = await r6api.getRanks(PLATFORM, p.id, { regionIds: REGION, boardIds: 'pvp_ranked' });
        //console.log(stats[0]);
        // if the promise of an array 'stats' is empty, there're no stats for this player
        if (stats.length==0 || stats[0].seasons[Object.keys(stats[0].seasons)].regions[REGION].boards.pvp_ranked.updateTime=='1970-01-01T00:00:00+00:00'){
            embedStatMsg
                .setColor('RED')
                .setDescription("**" + p.username + "** does not have any ranked stats this season")
            return embedStatMsg
        }
        let rankedStatsPath = stats[0].seasons[Object.keys(stats[0].seasons)].regions[REGION].boards.pvp_ranked;
        // when was the last data update
        var statsUpdateTime = Math.abs(new Date(rankedStatsPath.updateTime)-new Date())/1000/60;
        var statsUpdateMsg = "Updated " + (statsUpdateTime).toFixed(0) + " minute(s) ago"
        if (statsUpdateTime>59){ statsUpdateTime=statsUpdateTime/60; statsUpdateMsg = "Updated " + (statsUpdateTime).toFixed(0) + " hour(s) ago"}

        // create embed message with stats
        embedStatMsg
            .setColor(stats[0].seasons[Object.keys(stats[0].seasons)].seasonColor)
            .setTitle("Open full profile")
            .setURL('https://r6.tracker.network/profile/id/'+ p.id)
            .setAuthor(p.username, p.avatar['146'])
            .setDescription("**" + p.username + "'s** seasonal RANKED stats on **" + stats[0].seasons[Object.keys(stats[0].seasons)].seasonName + "**")
            .setThumbnail(rankedStatsPath.current.icon)
            .addFields(
                { name: '__Current Rank__', value: '>>> **'+rankedStatsPath.current.name +'**\n**MMR** '+rankedStatsPath.current.mmr + '\n**Last match **' + (rankedStatsPath.lastMatch.mmrChange<0?"":"+") + rankedStatsPath.lastMatch.mmrChange +'\n**Max MMR**: '+ (rankedStatsPath.max.mmr).toFixed(0), inline: true },
                { name: '__Pew Pew__', value: '>>> **KD:** ' + rankedStatsPath.kd + '\n**KM** ' + (rankedStatsPath.kills/rankedStatsPath.matches).toFixed(2) + '\n**Kills** ' + rankedStatsPath.kills + '\n**Deaths** ' + rankedStatsPath.deaths, inline: true },
                { name: '__Matches__', value: '>>> **WL **' + (rankedStatsPath.wins/rankedStatsPath.losses).toFixed(1) + '\n**Matches **' + rankedStatsPath.matches + '\n**Win ** ' +rankedStatsPath.wins + '\n**Loss **' + rankedStatsPath.losses + '\n**Abandon **' + rankedStatsPath.abandons, inline: true },
            )
            .setImage(stats[0].seasons[Object.keys(stats[0].seasons)].seasonImage)
            .setFooter(statsUpdateMsg);
        return embedStatMsg;
    },

    /************************************************** */
    /**
     * 
     * @param {array of player stats} p 
     * @returns embed message with stats
     */
     getSeasonalCasualStats: async function (p){
        var embedStatMsg = new MessageEmbed()

        let stats = await r6api.getRanks(PLATFORM, p.id, { regionIds: REGION, boardIds: 'pvp_casual' });
        //console.log(stats[0]);
        // if the promise of an array 'stats' is empty, there're no stats for this player
        if (stats.length==0 || stats[0].seasons[Object.keys(stats[0].seasons)].regions[REGION].boards.pvp_casual.updateTime=='1970-01-01T00:00:00+00:00'){
            embedStatMsg
                .setColor('RED')
                .setDescription("**" + p.username + "** does not have any casual stats this season")
            return embedStatMsg
        }
        let casualStatsPath = stats[0].seasons[Object.keys(stats[0].seasons)].regions[REGION].boards.pvp_casual;
        // create embed message with stats
        embedStatMsg
            .setColor(stats[0].seasons[Object.keys(stats[0].seasons)].seasonColor)
            .setTitle("Open full profile")
            .setURL('https://r6.tracker.network/profile/id/'+ p.id)
            .setAuthor(p.username, p.avatar['146'])
            .setDescription("**" + p.username + "'s** seasonal CASUAL stats on **" + stats[0].seasons[Object.keys(stats[0].seasons)].seasonName + "**")
            .setThumbnail(casualStatsPath.current.icon)
            .addFields(
                { name: 'Current Rank:', value: '>>> **'+casualStatsPath.current.name +'**\n**MMR** '+casualStatsPath.current.mmr + ' | **' + (casualStatsPath.lastMatch.mmrChange<0?"":"+") + casualStatsPath.lastMatch.mmrChange +'**\n**Max MMR**: '+ casualStatsPath.max.mmr, inline: true },
                { name: 'Pew Pew:', value: '>>> **K/D:** ' + casualStatsPath.kd + '  **\nK/M:** ' + (casualStatsPath.kills/casualStatsPath.matches).toFixed(2) + '\n**Kills:** ' + casualStatsPath.kills + '  **Deaths:** ' + casualStatsPath.deaths, inline: true },
                { name: '** **', value: '** ** ', inline: true },
                { name: 'Matches:', value: '>>> **Total: **' + casualStatsPath.matches + '**W/L: **' + (casualStatsPath.wins/casualStatsPath.losses).toFixed(1) + '\n**Win: ** ' + casualStatsPath.wins + ' **Loss: **' + casualStatsPath.losses + '\n**Abandon: **' + casualStatsPath.abandons, inline: true },
            )
            .setImage(stats[0].seasons[Object.keys(stats[0].seasons)].seasonImage)
            .setFooter("Oh hi :')");
        return embedStatMsg;
    },


    /************************************************** */
    /**
     * 
     * @param {array of player stats} ops
     * @returns the most played operators
    */
    getTheMostPlayedOperators: function(ops){
        let k = Object.keys(ops);
        var arrayOfAttackers = [];
        var arrayOfDefenders = [];
        // Splitting the array into two individual arrays: Attackers and Defenders
        for (let i=0; i<k.length; i++){
            if (ops[k[i]].role=='attacker') {
                arrayOfAttackers.push(ops[k[i]]);
            }
            else {
                arrayOfDefenders.push(ops[k[i]]);
            }
        }
        
        // Searching the most played operators => [attacker,defender]
        let theMostPlayedAttacker = arrayOfAttackers.reduce((max, attacker) => max.playtime > attacker.playtime ? max : attacker);
        let theMostPlayedDefender = arrayOfDefenders.reduce((max, defender) => max.playtime > defender.playtime ? max : defender);

        return [theMostPlayedAttacker, theMostPlayedDefender]
    },

    /************************************************** */
    /**
     * 
     * @param {array of player stats} p 
     * @returns embed message with stats
     */
    getGeneralStats: async function (p){
        var embedStatMsg = new MessageEmbed()

        let generalInfo = await r6api.getProgression(PLATFORM, p.id);
        let stats = await r6api.getStats(PLATFORM, p.id);

        if (stats.length==0){
            embedStatMsg
                .setColor('RED')
                .setDescription("No R6S stats were found for **" + p.username + "**");
            return embedStatMsg;
        }

        // get stats from 'unranked' game mode
        let unranked = await ubi.getUnrankedStats(p.id);
        let pvpStatPath = stats[0].pvp;

        // find the most played operators (1 attacker and 1 defender)
        let trendingOps = this.getTheMostPlayedOperators(pvpStatPath.operators)
        // find the most played operator among the two
        let mainOp = trendingOps.reduce((max, op) => max.playtime > op.playtime ? max : op);

        // get the best rank
        let theBestRank = await ubi.getTheBestRank(p.id);

        embedStatMsg
            .setColor("#F1C40F")
            .setTitle("Open full profile")
            .setURL('https://r6.tracker.network/profile/id/'+ p.id)
            .setAuthor(p.username, (p.avatar['146']))
            .setDescription("**" + p.username + "'s** GENERAL stats")
            .setThumbnail(mainOp.icon)
            .addFields(
                { name: '__Summary__', value: '>>> **Level **' + generalInfo[0].level + '\n**Best MMR** ' + (theBestRank.mmr).toFixed(0) +'\n***' + theBestRank.rank + '***', inline: true},
                { name: '__General__', value: ' >>> **Time played ** ' + (pvpStatPath.general.playtime/3600).toFixed(0) + 'H\n**Matches** ' + pvpStatPath.general.matches + '\n**Winrate **'+ pvpStatPath.general.winRate, inline: true },
                { name: '_ _', value: '>>> **WL ** ' + (pvpStatPath.general.wins/pvpStatPath.general.losses).toFixed(1) +'\n**KD ** ' + pvpStatPath.general.kd + '\n**HS** ' + (100*pvpStatPath.general.headshots/pvpStatPath.general.kills).toFixed(0) + '%' , inline: true},
                { name: '__Casual__', value: ' >>> **Played **'+(pvpStatPath.queues.casual.playtime/3600).toFixed(0) + 'H\n**WL **' + (pvpStatPath.queues.casual.wins/pvpStatPath.queues.casual.losses).toFixed(1) + '\n**KD** ' + pvpStatPath.queues.casual.kd + '\n**KM** ' + (pvpStatPath.queues.casual.kills/pvpStatPath.queues.casual.matches).toFixed(2), inline: true },
                { name: '__Unranked__', value: ' >>> **Played **'+(unranked[0]).toFixed(0) + 'H\n**WL **' + (unranked[1]).toFixed(1) + '\n**KD** ' + (unranked[2]).toFixed(1) + '\n**KM** ' + (unranked[3]).toFixed(2), inline: true },
                { name: '__Ranked__', value: ' >>> **Played **'+(pvpStatPath.queues.ranked.playtime/3600).toFixed(0) + 'H\n**WL **' + (pvpStatPath.queues.ranked.wins/pvpStatPath.queues.ranked.losses).toFixed(1) + '\n**KD** ' + pvpStatPath.queues.ranked.kd + '\n**KM** ' + (pvpStatPath.queues.ranked.kills/pvpStatPath.queues.ranked.matches).toFixed(2), inline: true },
                { name: '__Main ops__', value: '```yaml\n'+ trendingOps[0].name +'\n``` **Played **' + (trendingOps[0].playtime/3600).toFixed(0) + 'H\n**KD** ' + trendingOps[0].kd + '\n**HS** ' + (100*trendingOps[0].headshots/trendingOps[0].kills).toFixed(0) + '% \n**Winrate** ' + trendingOps[0].winRate, inline: true },
                { name: '_ _', value: '```arm\n'+ trendingOps[1].name +'\n``` **Played **' + (trendingOps[1].playtime/3600).toFixed(0) + 'H\n**KD** ' + trendingOps[1].kd + '\n**HS** ' + (100*trendingOps[1].headshots/trendingOps[1].kills).toFixed(0) + '% \n**Winrate** ' + trendingOps[1].winRate, inline: true },
                )
            .setFooter('Unranked stats can sometimes be inaccurate. Waiting for updates from Ubisoft...')
        return embedStatMsg;
    }

}