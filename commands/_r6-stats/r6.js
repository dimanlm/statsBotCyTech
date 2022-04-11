const { MessageEmbed } = require('discord.js');
var def = require('../../api_methods/r6/default')

var help = require('../support/help')

/************************************************** */
/**
 * The main function
 * @param {discord message} message 
 * @param {arguments, args[0] is a nickname} args 
 */
const axios = require('axios').default;

async function execute(message, args) {
    let username = args[0]
    
    //console.log(await auth_1.getAuth())
      
    switch(username){
        case undefined:
            help.execute(message)
            break;

        default:
            const player = await def.findPlayer(username);

            // if the promise of an array 'player' is empty, the player does not exist
            if (player.length==0){
                var embedMsg = new MessageEmbed()
                .setColor('RED')
                .setDescription("**"+username+ "** does not exist")
                message.reply({embeds:[embedMsg]}); 
                break;
            }

            var getPlayerStats = await def.getSeasonalRankedSummary(player[0]);
            
            if (getPlayerStats.description == 'This player does not have any stats'){
                await message.reply({ embeds: [getPlayerStats] });
                break;    
            }

            await message.reply({ embeds: [getPlayerStats] });

            /** 
             * button interaction
             * 
             * 
             */

            break;
    }
}

/************************************************** */
/************************************************** */

module.exports = {
    name: 'r6',
    description: "Seasonal **RANKED Summary**",
    execute
}