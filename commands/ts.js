const { MessageActionRow, MessageButton } = require('discord.js');

module.exports ={
    name: 'ts',
    description: ": Sends info about our TeamSpeak server.",
    execute(msg){
                
        const row = new MessageActionRow().addComponents(

            new MessageButton()
                .setLabel('Pay for the server')
                .setURL('https://nlm.xts3.ru')
                .setStyle('LINK'),
        );

        msg.reply({ content: '**TeamSpeak server link:** ```nlm.xts3.ru```', components: [row] });


    }
}