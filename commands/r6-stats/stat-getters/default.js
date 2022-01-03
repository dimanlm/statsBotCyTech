/** *** Here we use the default methods from r6api.js module *** **/

/** 
 * Init
*/
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

const R6API = require('r6api.js').default;
const { YOUR_UBI_ACC_MAIL, YOUR_UBI_ACC_PASSWORD, PLATFORM, REGION, CURRENT_SEASON } = require("../../../data/default.json");

const { UBI_EMAIL: email = YOUR_UBI_ACC_MAIL, UBI_PASSWORD: password = YOUR_UBI_ACC_PASSWORD } = process.env;
const r6api = new R6API({ email, password });

/** If it doesnt log in, you can try this:  **/
// const { UBI_EMAIL: email = 'YOUR-UBI-ACC-EMAIL', UBI_PASSWORD: password = 'YOUR-UBI-ACC-PASSWD' } = process.env;
// const r6api = new R6API({ email, password });

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
            let player = await r6api.findByUsername(PLATFORM, u);
            return player;
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
        stats = await r6api.getRanks(PLATFORM, p.id, { regionIds: REGION, boardIds: 'pvp_ranked' });

        if (stats.length==0 ){
            var embedStatMsg = new MessageEmbed()
                .setColor('RED')
                .setDescription("**" + p.username + "** does not have any stats")
            return(embedStatMsg);
        }
        let rankedStatsPath = stats[0].seasons[CURRENT_SEASON].regions[REGION].boards.pvp_ranked;
        //console.log(rankedStatsPath)

        // create embed message with stats
        var embedStatMsg = new MessageEmbed()
            .setColor(stats[0].seasons[CURRENT_SEASON].seasonColor)
            .setTitle("Open full profile")
            .setURL('https://r6.tracker.network/profile/id/'+ p.id)
            .setAuthor(p.username, p.avatar['146'])
            .setDescription("**" + p.username + "'s** seasonal RANKED stats on **" + stats[0].seasons[CURRENT_SEASON].seasonName + "**")
            .setThumbnail(rankedStatsPath.current.icon)
            .addFields(
                { name: '__Current Rank__', value: ' > **'+rankedStatsPath.current.name +'**\n > **MMR** '+rankedStatsPath.current.mmr + '\n > **Last match **' + (rankedStatsPath.lastMatch.mmrChange<0?"":"+") + rankedStatsPath.lastMatch.mmrChange +'\n > **Max MMR**: '+ rankedStatsPath.max.mmr, inline: true },
                { name: '__Pew Pew__', value: ' > **KD:** ' + rankedStatsPath.kd + '\n > **KM** ' + (rankedStatsPath.kills/rankedStatsPath.matches).toFixed(2) + '\n > **Kills** ' + rankedStatsPath.kills + '\n > **Deaths** ' + rankedStatsPath.deaths, inline: true },
                { name: '__Matches__', value: ' > **WL **' + (rankedStatsPath.wins/rankedStatsPath.losses).toFixed(1) + '\n > **Matches **' + rankedStatsPath.matches + '\n > **Win ** ' +rankedStatsPath.wins + '\n > **Loss **' + rankedStatsPath.losses + '\n > **Abandon **' + rankedStatsPath.abandons, inline: true },
            )
            .setFooter("Oh hi :')");  
        return(embedStatMsg);
    },

    /************************************************** */
    /**
     * 
     * @param {array of player stats} p 
     * @returns embed message with stats
     */
    getSeasonalRankedStats: async function (p){
        stats = await r6api.getRanks(PLATFORM, p.id, { regionIds: REGION, boardIds: 'pvp_ranked' });
        //console.log(stats[0]);
        // if the promise of an array 'stats' is empty, there're no stats for this player
        if (stats.length==0 || stats[0].seasons[CURRENT_SEASON].regions[REGION].boards.pvp_ranked.updateTime=='1970-01-01T00:00:00+00:00'){
            var embedStatMsg = new MessageEmbed()
                .setColor('RED')
                .setDescription("**" + p.username + "** does not have any ranked stats this season")
            return embedStatMsg
        }
        let rankedStatsPath = stats[0].seasons[CURRENT_SEASON].regions[REGION].boards.pvp_ranked;
        // create embed message with stats
        var embedStatMsg = new MessageEmbed()
            .setColor(stats[0].seasons[CURRENT_SEASON].seasonColor)
            .setTitle("Open full profile")
            .setURL('https://r6.tracker.network/profile/id/'+ p.id)
            .setAuthor(p.username, p.avatar['146'])
            .setDescription("**" + p.username + "'s** seasonal RANKED stats on **" + stats[0].seasons[CURRENT_SEASON].seasonName + "**")
            .setThumbnail(rankedStatsPath.current.icon)
            .addFields(
                { name: '__Current Rank__', value: ' > **'+rankedStatsPath.current.name +'**\n > **MMR** '+rankedStatsPath.current.mmr + '\n > **Last match **' + (rankedStatsPath.lastMatch.mmrChange<0?"":"+") + rankedStatsPath.lastMatch.mmrChange +'\n > **Max MMR**: '+ rankedStatsPath.max.mmr, inline: true },
                { name: '__Pew Pew__', value: ' > **KD:** ' + rankedStatsPath.kd + '\n > **KM** ' + (rankedStatsPath.kills/rankedStatsPath.matches).toFixed(2) + '\n > **Kills** ' + rankedStatsPath.kills + '\n > **Deaths** ' + rankedStatsPath.deaths, inline: true },
                { name: '__Matches__', value: ' > **WL **' + (rankedStatsPath.wins/rankedStatsPath.losses).toFixed(1) + '\n > **Matches **' + rankedStatsPath.matches + '\n > **Win ** ' +rankedStatsPath.wins + '\n > **Loss **' + rankedStatsPath.losses + '\n > **Abandon **' + rankedStatsPath.abandons, inline: true },
            )
            .setImage(stats[0].seasons[CURRENT_SEASON].seasonImage)
            .setFooter("Oh hi :')");
        return embedStatMsg;
    },

    /************************************************** */
    /**
     * 
     * @param {array of player stats} p 
     * @returns embed message with stats
     */
     getSeasonalCasualStats: async function (p){
        stats = await r6api.getRanks(PLATFORM, p.id, { regionIds: REGION, boardIds: 'pvp_casual' });
        //console.log(stats[0]);
        // if the promise of an array 'stats' is empty, there're no stats for this player
        if (stats.length==0 || stats[0].seasons[CURRENT_SEASON].regions[REGION].boards.pvp_casual.updateTime=='1970-01-01T00:00:00+00:00'){
            var embedStatMsg = new MessageEmbed()
                .setColor('RED')
                .setDescription("**" + p.username + "** does not have any casual stats this season")
            return embedStatMsg
        }
        let casualStatsPath = stats[0].seasons[CURRENT_SEASON].regions[REGION].boards.pvp_casual;
        // create embed message with stats
        var embedStatMsg = new MessageEmbed()
            .setColor(stats[0].seasons[CURRENT_SEASON].seasonColor)
            .setTitle("Open full profile")
            .setURL('https://r6.tracker.network/profile/id/'+ p.id)
            .setAuthor(p.username, p.avatar['146'])
            .setDescription("**" + p.username + "'s** seasonal CASUAL stats on **" + stats[0].seasons[CURRENT_SEASON].seasonName + "**")
            .setThumbnail(casualStatsPath.current.icon)
            .addFields(
                { name: 'Current Rank:', value: '> **'+casualStatsPath.current.name +'**\n > **MMR** '+casualStatsPath.current.mmr + ' | **' + (casualStatsPath.lastMatch.mmrChange<0?"":"+") + casualStatsPath.lastMatch.mmrChange +'**\n > **Max MMR**: '+ casualStatsPath.max.mmr, inline: true },
                { name: 'Pew Pew:', value: '> **K/D:** ' + casualStatsPath.kd + '  **\n > K/M:** ' + (casualStatsPath.kills/casualStatsPath.matches).toFixed(2) + '\n > **Kills:** ' + casualStatsPath.kills + '  **Deaths:** ' + casualStatsPath.deaths, inline: true },
                { name: '** **', value: '** ** ', inline: true },
                { name: 'Matches:', value: '> **W/L: **' + casualStatsPath.winRate + '\n > **Matches: **' + casualStatsPath.matches + '\n > **Win: ** ' + casualStatsPath.wins + ' **Loss: **' + casualStatsPath.losses + '\n > **Abandon: **' + casualStatsPath.abandons, inline: true },
            )
            .setImage(stats[0].seasons[CURRENT_SEASON].seasonImage)
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
        for (let i=0;i<k.length;i++){
            if (ops[k[i]].role=='attacker') {
                arrayOfAttackers.push(ops[k[i]]);
            }
            else {
                arrayOfDefenders.push(ops[k[i]]);
            }
        }
        // Searching the most played operators => [attacker,defender]
        let theMostPlayedAttacker = arrayOfAttackers[0]
        let theMostPlayedDefender = arrayOfDefenders[0]
        for (let i = 0; i <arrayOfAttackers.length; i++){
            if (theMostPlayedAttacker.playtime < arrayOfAttackers[i].playtime) theMostPlayedAttacker = arrayOfAttackers[i]
        }
        for (let i = 0; i <arrayOfDefenders.length; i++){
            if (theMostPlayedDefender.playtime < arrayOfDefenders[i].playtime) theMostPlayedDefender = arrayOfDefenders[i]
        }

        return [theMostPlayedAttacker, theMostPlayedDefender]
    },

    /************************************************** */
    /**
     * 
     * @param {array of player stats} p 
     * @returns embed message with stats
     */
    getGeneralStats: async function (p){
        generalInfo = await r6api.getProgression(PLATFORM, p.id);
        stats = await r6api.getStats(PLATFORM, p.id);

        if (stats.length==0){
            var embedStatMsg = new MessageEmbed()
                .setColor('RED')
                .setDescription("No R6S stats were found for **" + p.username + "**");
            return embedStatMsg;
        }
        let pvpStatPath = stats[0].pvp;

        let ops = this.getTheMostPlayedOperators(pvpStatPath.operators)
        /**
         * methods with the most played ops :)
         */

        var embedStatMsg = new MessageEmbed()
            .setColor("#F1C40F")
            .setTitle("Open full profile")
            .setURL('https://r6.tracker.network/profile/id/'+ p.id)
            .setAuthor(p.username, (p.avatar['146']))
            .setDescription("**" + p.username + "'s** GENERAL PVP stats")
            .setThumbnail(p.avatar['146'])
            .addFields(
                { name: '__General__', value: ' > **Level **' + generalInfo[0].level + '\n > **Hours ** ' + (pvpStatPath.general.playtime/3600).toFixed(1) + '\n > **WL ** ' + (pvpStatPath.general.wins/pvpStatPath.general.losses).toFixed(1) +'\n > **KD ** ' + pvpStatPath.general.kd, inline: true },
                { name: '__Matches__', value: ' > **Total **' + pvpStatPath.general.matches + '\n > **Win ** ' +pvpStatPath.general.wins + '\n > **Loss **' + pvpStatPath.general.losses + '\n > **Winrate **'+ pvpStatPath.general.winRate, inline: true },
                { name: '__Mains__', value: '** ** ', inline: true },
                { name: '__Casual__', value: ' > **Hours **'+(pvpStatPath.queues.casual.playtime/3600).toFixed(1) + '\n > **WL **' + (pvpStatPath.queues.casual.wins/pvpStatPath.queues.casual.losses).toFixed(1) + '\n > **KD** ' + pvpStatPath.queues.casual.kd + '\n > **KM** ' + (pvpStatPath.queues.casual.kills/pvpStatPath.queues.casual.matches).toFixed(2), inline: true },
                { name: '__Ranked__', value: ' > **Hours **'+(pvpStatPath.queues.ranked.playtime/3600).toFixed(1) + '\n > **WL **' + (pvpStatPath.queues.ranked.wins/pvpStatPath.queues.ranked.losses).toFixed(1) + '\n > **KD** ' + pvpStatPath.queues.ranked.kd + '\n > **KM** ' + (pvpStatPath.queues.ranked.kills/pvpStatPath.queues.ranked.matches).toFixed(2), inline: true },
                { name: '** **', value: '** ** ', inline: true },
                )
            .setImage('https://as01.epimg.net/meristation/imagenes/2021/03/19/noticias/1616165187_780184_1616165764_noticia_normal.jpg')
            .setFooter("Oh ño! :')");
        return embedStatMsg;
    }

}