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
            //const buttons = buttonRow();
            
            if (getPlayerStats.description == 'This player does not have any stats'){
                await message.reply({ embeds: [getPlayerStats] });
                break;    
            }

            //await message.reply({ embeds: [getPlayerStats], components:[buttons] });
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

// /************************************************** */
// /** For now I will not add buttons for stats pagination

//  * Method to show buttons below the embed message
//  * @returns a row of buttons
//  */
// function buttonRow() {

//     var btnRow = new MessageActionRow()
//         .addComponents(
//             new MessageButton()
//             .setCustomId('summary')
//             .setLabel('Summary')
//             .setStyle('DANGER')
//             .setDisabled(true)
//         )
//         .addComponents(
//             new MessageButton()
//             .setCustomId('seasonal')
//             .setLabel('SEASONAL')
//             .setStyle('PRIMARY')
//         )
//         .addComponents(
//             new MessageButton()
//             .setCustomId('general')
//             .setLabel('GENERAL')
//             .setStyle('PRIMARY')
//             .setEmoji('🎓')
//         )
    
//     return(btnRow)
// }


// message.client.on('interactionCreate', async i => {
            //     if (!i.isButton()) return;
            //     switch (i.customId){
            //         case 'general':
            //             var embedMsg = await getGeneralStats(player[0]);
            //             buttons.components[2].setDisabled(true);
            //             break;
            //         case 'seasonal':
            //             var embedMsg = await getSeasonalRankedStats(player[0]);
            //             buttons.components[1].setDisabled(true);
            //             break;
            //         default:
            //             var embedMsg = await getSeasonalRankedSummary(player[0]);
            //             buttons.components[0].setDisabled(true);
            //             break;
            //     }

            //     // await i.update({ embeds: [getPlayerStats], components:[buttons] });
            
            //     await i.deferReply({ ephemeral: true });
            //     await i.editReply({ embeds:[embedMsg], components:[buttons] });
            // });