const auth_1 = require('../../node_modules/r6api.js/dist/auth');
const { MessageEmbed } = require('discord.js');
var def = require('./stat-getters/default')

/************************************************** */
/**
 * The main function
 * @param {discord message} message 
 * @param {arguments, args[0] is a nickname} args 
 */
const axios = require('axios').default;

async function execute(message, args) {
    let username = args[0]
          
    switch(username){
        case undefined:
            message.reply("Command usage: `!ranked [nickname]` \n > ***Example:***\n > `!ranked Shaiiko.BDS`")
            break;

        default:
            const player = await def.findPlayer(username);

            if (player.length==0){
                var embedMsg = new MessageEmbed()
                .setColor('RED')
                .setDescription("**"+username+ "** does not exist")
                message.reply({embeds:[embedMsg]}); 
                break;
            }

            var getPlayerStats = await def.getSeasonalRankedStats(player[0]);
            
            if (getPlayerStats.description == 'This player does not have any ranked stats'){
                await message.reply({ embeds: [getPlayerStats] });
                break;    
            }

            await message.reply({ embeds: [getPlayerStats] });
            break;
    }
}

/************************************************** */
/************************************************** */

module.exports = {
    name: 'ranked',
    description: "Seasonal **RANKED** stats (more informative)",
    execute
}
