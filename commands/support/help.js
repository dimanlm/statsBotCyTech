const fs = require('fs');
const { MessageEmbed } = require('discord.js');

function helpCommand () {
    let helpMsg = [];

    const cmdDirs = fs.readdirSync('./commands');

    /* Loop through subdirectories in commands directory */
    for (let dir of cmdDirs) {
        /* Read every subdirectory and filter for JS files */
        let commandFiles = fs.readdirSync(`./commands/${dir}`)
        .filter(f => f.endsWith('.js'));
        let tmp = [];

        /* Loop through every file */
        for (let file of commandFiles) {
            /* Set command file */
            let requestedCommand = require(`../../commands/${dir}/${file}`);
            tmp.push([requestedCommand.description + ': ```$' + requestedCommand.name]);
        };
        helpMsg.push(tmp)
    };

    return helpMsg;
}

module.exports = {
    name: 'help',
    description: 'Shows all the available commands.',
    execute(msg) {
        let arrayOfCommands = helpCommand();
        let commands = '';
        
        var embedMsg = new MessageEmbed()
                .setColor('ORANGE')
                .addFields({
                            name: '__Rainbow Six Siege Tracker__',
                            value: (
                            arrayOfCommands[0][2] + ' [nickname]```\n' +
                            arrayOfCommands[0][3] + ' [nickname]```\n' +
                            arrayOfCommands[0][0] + ' [nickname]```\n' +
                            arrayOfCommands[0][1] + ' [nickname]```\n'
                            ),
                            inline:true},

                        )
    
        // getting the rest of the commands
        for (var i = 1; i < arrayOfCommands.length; i++) {
            var commandCategory = arrayOfCommands[i]
            for (var j =0; j < commandCategory.length; j++) {
                commands+= commandCategory[j] + '```\n'   
            }
        }
        // add those commands to the embedMsg
        embedMsg
        .addFields({
                        name: '** **',
                        value: '** **',
                        inline:true
                    },
                    {
                        name: '__MORE__',
                        value: commands,
                        inline:true
                    },
                    {
                        name: 'Examples',
                        value: (
                        '`$r6 ThinkinNade.SSG`\n `$general Shaiiko.BDS`\n `$casual SHA77ELELE`'),
                        inline:false
                    })
        
        msg.reply({embeds: [embedMsg]})

    }
};