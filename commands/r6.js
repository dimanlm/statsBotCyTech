require('dotenv').config();
const R6API = require('r6api.js').default;
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { YOUR_UBI_ACC_MAIL, YOUR_UBI_ACC_PASSWORD, PLATFORM, REGION, CURRENT_SEASON } = require("../data/default.json");


const { UBI_EMAIL: email = YOUR_UBI_ACC_MAIL, UBI_PASSWORD: password = YOUR_UBI_ACC_PASSWORD } = process.env;
const r6api = new R6API({ email, password });

module.exports = {
    name: 'r6',
    description: "<nickname> <optional type>: Gets R6S stats.",
    execute(msg, args) {
        let username = args[0];
        let statType = args[1];

        if (username!=undefined){
            const player = r6api.findByUsername(PLATFORM, username);
            
            /** 
             * 'player' is promise of an array
             * i will use the map function (res.map(p)) to get the data from the array player's ID (p.id) and use it in another function (for example r6api.getRanks) to get the stats
             */
            player.then(res =>{
                res.map(p=>{
                    switch (statType){

                        // general stats
                        case 'g':
                            var getPlayerStats = async () => {
                                generalInfo = await r6api.getProgression(PLATFORM, p.id);
                                stats = await r6api.getStats(PLATFORM, p.id);
                                pvpStatPath = stats[0].pvp;
                                
                                const embedStatMsg = new MessageEmbed()
                                    .setColor("#F1C40F")
                                    .setTitle("Open full profile on r6tracker")
                                    .setURL('https://r6.tracker.network/profile/id/'+ p.id)
                                    .setAuthor(p.username)
                                    .setDescription("**" + p.username + "'s** GENERAL PVP stats")
                                    .setThumbnail(p.avatar['146'])
                                    .addFields(
                                        { name: 'General:', value: '**Level: **' + generalInfo[0].level + '\n**Hours: ** ' + (pvpStatPath.general.playtime/3600).toFixed(1) + '\n**KD: ** ' + pvpStatPath.general.kd + '\n**Winrate: ** ' + pvpStatPath.general.winRate, inline: false },
                                        { name: 'Casual:', value: '**Hours: **'+(pvpStatPath.queues.casual.playtime/3600).toFixed(1) +'\n**K/D:** ' + pvpStatPath.queues.casual.kd + '  **\nK/M:** ' + (pvpStatPath.queues.casual.kills/pvpStatPath.queues.casual.matches).toFixed(2) + '\n **Winrate: **' + pvpStatPath.queues.casual.winRate, inline: true },
                                        { name: 'Ranked:', value: '**Hours: **'+(pvpStatPath.queues.ranked.playtime/3600).toFixed(1) +'\n**K/D:** ' + pvpStatPath.queues.ranked.kd + '  **\nK/M:** ' + (pvpStatPath.queues.ranked.kills/pvpStatPath.queues.ranked.matches).toFixed(2) + '\n **Winrate: **' + pvpStatPath.queues.ranked.winRate, inline: true },
                                        //{ name: 'Matches:', value: '**W/L: **' + rankedStatsPath.winRate + '\n **Matches: **' + rankedStatsPath.matches + '\n **Win: ** ' +rankedStatsPath.wins + ' **Loss: **' + rankedStatsPath.losses + '\n **Abandon: **' + rankedStatsPath.abandons, inline: true },
                                    )
                                    .setImage('https://as01.epimg.net/meristation/imagenes/2021/03/19/noticias/1616165187_780184_1616165764_noticia_normal.jpg')
                                    .setFooter("Oh ño! :')");
                                

                                console.log(pvpStatPath.queues)
                                msg.reply({ embeds: [embedStatMsg], components:[] });
                                
                            }
                            break;
                        
                        // t hunt stats
                        case 'th':
                            var getPlayerStats = async () => {
                                stats = await r6api.getStats(PLATFORM, p.id);

                                const embedStatMsg = new MessageEmbed()
                                    .setColor("#206694")
                                    .setTitle("Open full profile on r6tracker")
                                    .setURL('https://r6.tracker.network/profile/id/'+ p.id)
                                    .setAuthor(p.username)
                                    .setDescription("**" + p.username + "'s** Terrorist Hunt stats")
                                    .setThumbnail(p.avatar['146'])
                                    .addFields(
                                        //{ name: 'Current Rank:', value: '**'+rankedStatsPath.current.name +'**\n**MMR** '+rankedStatsPath.current.mmr + ' | **' + (rankedStatsPath.lastMatch.mmrChange<0?"":"+") + rankedStatsPath.lastMatch.mmrChange +'**\n **Max MMR**: '+ rankedStatsPath.max.mmr, inline: true },
                                        //{ name: 'Pew Pew:', value: '**K/D:** ' + rankedStatsPath.kd + '  **\nK/M:** ' + (rankedStatsPath.kills/rankedStatsPath.matches).toFixed(2) + '\n**Kills:** ' + rankedStatsPath.kills + '  **Deaths:** ' + rankedStatsPath.deaths, inline: true },
                                        { name: '** **', value: '** ** ', inline: true },
                                        //{ name: 'Matches:', value: '**W/L: **' + rankedStatsPath.winRate + '\n **Matches: **' + rankedStatsPath.matches + '\n **Win: ** ' +rankedStatsPath.wins + ' **Loss: **' + rankedStatsPath.losses + '\n **Abandon: **' + rankedStatsPath.abandons, inline: true },
                                    )
                                    .setFooter("Oh hi :')");                                
                                msg.reply({ embeds: [embedStatMsg] });
                                
                            }
                            break;
                        
                        // by default, it returns only seasonal ranked stats
                        default:
                            var getPlayerStats = async () => {
                                stats = await r6api.getRanks(PLATFORM, p.id, { regionIds: REGION, boardIds: 'pvp_ranked' });
                                let rankedStatsPath = stats[0].seasons[CURRENT_SEASON].regions[REGION].boards.pvp_ranked;
                                // create embed message with stats
                                const embedStatMsg = new MessageEmbed()
                                    .setColor(stats[0].seasons[CURRENT_SEASON].seasonColor)
                                    .setTitle("Open full profile on r6tracker")
                                    .setURL('https://r6.tracker.network/profile/id/'+ p.id)
                                    .setAuthor(p.username, p.avatar['146'])
                                    .setDescription("**" + p.username + "'s** seasonal RANKED stats on **" + stats[0].seasons[CURRENT_SEASON].seasonName + "**")
                                    .setThumbnail(rankedStatsPath.current.icon)
                                    .addFields(
                                        { name: 'Current Rank:', value: '**'+rankedStatsPath.current.name +'**\n**MMR** '+rankedStatsPath.current.mmr + ' | **' + (rankedStatsPath.lastMatch.mmrChange<0?"":"+") + rankedStatsPath.lastMatch.mmrChange +'**\n **Max MMR**: '+ rankedStatsPath.max.mmr, inline: true },
                                        { name: 'Pew Pew:', value: '**K/D:** ' + rankedStatsPath.kd + '  **\nK/M:** ' + (rankedStatsPath.kills/rankedStatsPath.matches).toFixed(2) + '\n**Kills:** ' + rankedStatsPath.kills + '  **Deaths:** ' + rankedStatsPath.deaths, inline: true },
                                        { name: '** **', value: '** ** ', inline: true },
                                        { name: 'Matches:', value: '**W/L: **' + rankedStatsPath.winRate + '\n **Matches: **' + rankedStatsPath.matches + '\n **Win: ** ' +rankedStatsPath.wins + ' **Loss: **' + rankedStatsPath.losses + '\n **Abandon: **' + rankedStatsPath.abandons, inline: true },
                                    )
                                    .setImage(stats[0].seasons[CURRENT_SEASON].seasonImage)
                                    .setFooter("Oh hi :')");                                
                                msg.reply({ embeds: [embedStatMsg] });
                            };
                            break;
                    }
                    
                    const printTheStats = async () => {
                        await getPlayerStats();
                    }
                    printTheStats();
        
                });                
            });
        } // end if
        else{
            msg.reply("Command usage: `!r6 [nickname] [(optional) type]` \n`[(optinal) type]` : \n**Seasonal ranked: ** just leave it empty \n**General: ** `g` \n**T Hunt: ** `th` \n\n ***Examples:***\n`!r6 pengu.g2` `!r6 pengu.g2 g`")
        }
    }
}