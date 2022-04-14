const customCmdModel = require('../../models/customCmdSchema');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const prefix = require('../../config/prefix.json');

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
            tmp.push([requestedCommand.description + ': ```' + prefix + requestedCommand.name]);
        }
        helpMsg.push(tmp)
    }

    return helpMsg;
}

module.exports = {
    name: 'help',
    description: 'Shows all the available commands.',
    async execute(msg) {
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
                            {
                                name: '** **',
                                value: '** **',
                                inline:true
                            },
                            {
                                name: 'Examples',
                                value: (
                                '```' + prefix + 'r6 chocoiatine\n' + prefix + 'general polloman\n' + prefix + 'casual kmeme5```'),
                                inline:true
                            }

                        )
    
        // getting the rest of the commands
        for (var i = 1; i < arrayOfCommands.length; i++) {
            var commandCategory = arrayOfCommands[i]
            for (var j of Object.keys(commandCategory)) {
                commands+= commandCategory[j] + '```\n'   
            }
        }
        // add those commands to the embedMsg
        embedMsg
        .addFields(
                    {
                        name: '\u200B',
                        value: '\u200B'
                    },
                    {
                        name: '__MORE__',
                        value: commands,
                        inline:true
                    },
                    {
                        name: '** **',
                        value: '** **',
                        inline:true
                    },
                   )
        
        // add the custom commands to the embed
        let customDB = await customCmdModel.find({ guildId: msg.guild.id })
        // dont show the field if there's no custom commands
        if (customDB && customDB.length!=0){
            let cmdArray=[];
            customDB.forEach(element => {
                cmdArray.push(element.cmdName)                
            });
            embedMsg.addFields(
                {
                    name: '__CUSTOM COMMANDS__',
                    value: "```" + prefix + cmdArray.join("\n" + prefix) + "```",
                    inline:true
                }
            )
        }
        
        msg.reply({embeds: [embedMsg]})

    }
};