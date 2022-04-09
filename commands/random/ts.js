const { MessageActionRow, MessageButton } = require('discord.js');

module.exports ={
    name: 'ts',
    description: "Info about our TeamSpeak server",
    execute(msg){
                
        const row = new MessageActionRow().addComponents(

            new MessageButton()
                .setLabel('Pay for the server')
                .setURL('HTTP-LINK-TO-A-PAGE')
                .setStyle('LINK'),
        );

        msg.reply({ content: '**TeamSpeak server link:** ```TEAMSPEAK-IP```', components: [row] });

    }
}