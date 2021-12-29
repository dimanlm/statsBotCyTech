require('dotenv').config();
const R6API = require('r6api.js').default;
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { YOUR_UBI_ACC_MAIL, YOUR_UBI_ACC_PASSWORD, PLATFORM, REGION, CURRENT_SEASON } = require("../data/default.json");


const { UBI_EMAIL: email = YOUR_UBI_ACC_MAIL, UBI_PASSWORD: password = YOUR_UBI_ACC_PASSWORD } = process.env;
const r6api = new R6API({ email, password });

/************************************************** */

/**
 * Function that allows us to find and verify if a uplay profile exists
 * @param {username} u 
 * @returns a promise of array containting profile info
 */
async function findPlayer(u){
    try{
        let player = await r6api.findByUsername(PLATFORM, u);
        return player;
    }catch(e){
        console.log(e);
        return;
    }
}

/************************************************** */
/**
 * Function that allows us to get player's ranked summary for the current season
 * @param {array of player stats} p
 * @returns an embed message
 */
async function getSeasonalRankedSummary(p){
    stats = await r6api.getRanks(PLATFORM, p.id, { regionIds: REGION, boardIds: 'pvp_ranked' });

    if (stats.length==0){
        var embedStatMsg = new MessageEmbed()
            .setColor('RED')
            .setDescription("This player does not have any ranked stats")
    }else{
        let rankedStatsPath = stats[0].seasons[CURRENT_SEASON].regions[REGION].boards.pvp_ranked;
        // create embed message with stats
        var embedStatMsg = new MessageEmbed()
            .setColor(stats[0].seasons[CURRENT_SEASON].seasonColor)
            .setTitle("Open full profile on r6tracker")
            .setURL('https://r6.tracker.network/profile/id/'+ p.id)
            .setDescription(stats[0].seasons[CURRENT_SEASON].seasonName + " RANKED summary ")
            .setAuthor(p.username, p.avatar['146'])
            .setThumbnail(rankedStatsPath.current.icon)
            .addFields(
                { name: '** **', value: '> **MMR:** '+rankedStatsPath.current.mmr + ' \n > **Last match:** ' + (rankedStatsPath.lastMatch.mmrChange<0?"":"+") + rankedStatsPath.lastMatch.mmrChange, inline: true },
                { name: '** **', value: '> **KD:** ' + rankedStatsPath.kd + '\n > **KpM:** ' + (rankedStatsPath.kills/rankedStatsPath.matches).toFixed(2), inline: true },
                { name: '** **', value: '> **Win: ** ' +rankedStatsPath.wins + ' \n > **Loss:** ' + rankedStatsPath.losses, inline: true },
            );
        }
    return(embedStatMsg);
}

/************************************************** */
/**
 * 
 * @param {array of player stats} p 
 * @returns embed message with stats
 */
async function getSeasonalRankedStats(p){
    stats = await r6api.getRanks(PLATFORM, p.id, { regionIds: REGION, boardIds: 'pvp_ranked' });
    
    // if the promise of an array 'stats' is empty, there're no stats for this player
    if (stats.length==0){
        var embedStatMsg = new MessageEmbed()
            .setDescription("This player does not have any ranked stats")
    }else{
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
                { name: 'Current Rank:', value: '> **'+rankedStatsPath.current.name +'**\n > **MMR** '+rankedStatsPath.current.mmr + ' | **' + (rankedStatsPath.lastMatch.mmrChange<0?"":"+") + rankedStatsPath.lastMatch.mmrChange +'**\n > **Max MMR**: '+ rankedStatsPath.max.mmr, inline: true },
                { name: 'Pew Pew:', value: '> **K/D:** ' + rankedStatsPath.kd + '  **\n > K/M:** ' + (rankedStatsPath.kills/rankedStatsPath.matches).toFixed(2) + '\n > **Kills:** ' + rankedStatsPath.kills + '  **Deaths:** ' + rankedStatsPath.deaths, inline: true },
                { name: '** **', value: '** ** ', inline: true },
                { name: 'Matches:', value: '> **W/L: **' + rankedStatsPath.winRate + '\n > **Matches: **' + rankedStatsPath.matches + '\n > **Win: ** ' +rankedStatsPath.wins + ' **Loss: **' + rankedStatsPath.losses + '\n > **Abandon: **' + rankedStatsPath.abandons, inline: true },
            )
            .setImage(stats[0].seasons[CURRENT_SEASON].seasonImage)
            .setFooter("Oh hi :')");
    }
    return embedStatMsg;
}

/************************************************** */
/**
 * 
 * @param {array of player stats} p 
 * @returns embed message with stats
 */
async function getGeneralStats(p){
    generalInfo = await r6api.getProgression(PLATFORM, p.id);
    stats = await r6api.getStats(PLATFORM, p.id);

    if (stats.length==0){
        var embedStatMsg = new MessageEmbed()
            .setDescription("No general stats were found")
    }else{
        let pvpStatPath = stats[0].pvp;
        
        var embedStatMsg = new MessageEmbed()
            .setColor("#F1C40F")
            .setTitle("Open full profile")
            .setURL('https://r6.tracker.network/profile/id/'+ p.id)
            .setAuthor(p.username, p.avatar['146'])
            .setDescription("**" + p.username + "'s** GENERAL PVP stats")
            .setThumbnail(p.avatar['146'])
            .addFields(
                { name: 'General:', value: '> **Level **' + generalInfo[0].level + '\n > **Hours **' + (pvpStatPath.general.playtime/3600).toFixed(1) + '\n > **KD **' + pvpStatPath.general.kd + '\n > **Win **' + pvpStatPath.general.winRate, inline: false },
                { name: 'Casual:', value: ' > **Hours **'+(pvpStatPath.queues.casual.playtime/3600).toFixed(1) +'\n > **K/D **' + pvpStatPath.queues.casual.kd + '\n > **K/M **' + (pvpStatPath.queues.casual.kills/pvpStatPath.queues.casual.matches).toFixed(2) + '\n > **Win **' + pvpStatPath.queues.casual.winRate, inline: true },
                { name: 'Ranked:', value: ' > **Hours **'+(pvpStatPath.queues.ranked.playtime/3600).toFixed(1) +'\n > **K/D **' + pvpStatPath.queues.ranked.kd + '\n > **K/M **' + (pvpStatPath.queues.ranked.kills/pvpStatPath.queues.ranked.matches).toFixed(2) + '\n > **Win **' + pvpStatPath.queues.ranked.winRate, inline: true },
                //{ name: 'Matches:', value: '**W/L: **' + rankedStatsPath.winRate + '\n **Matches: **' + rankedStatsPath.matches + '\n **Win: ** ' +rankedStatsPath.wins + ' **Loss: **' + rankedStatsPath.losses + '\n **Abandon: **' + rankedStatsPath.abandons, inline: true },
            )
            .setImage('https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/7MBEOw8kIzHpDRCg2JHk5p/4b43a60603359e59e27ab13c5e379282/R6S-Y6-STANDARD.jpg')
            .setFooter("Oh ño! :')");
        }
    return embedStatMsg;
}

/************************************************** */
/**
 * Method to show buttons below the embed message
 * @returns a row of buttons
 */
function buttonRow() {

    var btnRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('summary')
            .setLabel('Summary')
            .setStyle('DANGER')
            .setDisabled(true)
        )
        .addComponents(
            new MessageButton()
            .setCustomId('seasonal')
            .setLabel('SEASONAL')
            .setStyle('PRIMARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('general')
            .setLabel('GENERAL')
            .setStyle('PRIMARY')
        )
    
    return(btnRow)
}

/************************************************** */
/**
 * The main function
 * @param {discord message} message 
 * @param {arguments, args[0] is a nickname} args 
 */
async function execute(message, args) {
    let username = args[0]
    // console.log(message.client)
    switch(username){
        case undefined:
            message.reply("Command usage: `!r6 [nickname]` \n > ***Example:***\n > `!r6 sangriia.`")
            break;

        default:
            const player = await findPlayer(username);

            // if the promise of an array 'player' is empty, the player does not exist
            if (player.length==0){
                message.reply("This player does not exist")
            }else{
                var getPlayerStats = await getSeasonalRankedSummary(player[0]);
                const buttons = buttonRow();


                await message.reply({ embeds: [getPlayerStats], components:[buttons] });

                message.client.on('interactionCreate', async i => {
                    if (!i.isButton()) return;
                    switch (i.customId){
                        case 'general':
                            var embedMsg = await getGeneralStats(player[0]);
                            buttons.components[0].setDisabled(false);
                            buttons.components[1].setDisabled(false);
                            buttons.components[2].setDisabled(true);
                            break;
                        case 'seasonal':
                            var embedMsg = await getSeasonalRankedStats(player[0]);
                            buttons.components[0].setDisabled(false);
                            buttons.components[1].setDisabled(true);
                            buttons.components[2].setDisabled(false);
                            break;
                        default:
                            var embedMsg = await getSeasonalRankedSummary(player[0]);
                            buttons.components[0].setDisabled(true);
                            buttons.components[1].setDisabled(false);
                            buttons.components[2].setDisabled(false);
                            break;
                    }                   
                    await i.update({ embeds:[embedMsg], components:[buttons] });
                });
            }
            break;
    }
}

/************************************************** */
/************************************************** */

module.exports = {
    name: 'r6',
    description: "<nickname>: Gets R6S stats.",
    execute 
}
