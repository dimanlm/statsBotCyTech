const customCmdModel = require('../../models/customCmdSchema')
const { MessageEmbed } = require('discord.js');
const prefix = require('../../config/prefix.json');

function checkAdmin(msg){
    return (msg.member.permissions.has("ADMINISTRATOR"));
}

module.exports = {
    name: 'add',
    description: 'Add a custom command',
    async execute (msg, args) {
        var embedMsg = new MessageEmbed();

        if(!checkAdmin(msg)) {
            embedMsg
                .setColor("RED")
                .setDescription(":no_entry_sign: You don't have permission to add a custom command.")
            msg.reply({embeds:[embedMsg]})
            return
        }
        
        let command = args[0];
        let response = args.slice(1).join(' ');
        
        // if custom command is missing
        if (!command || !response) {
            embedMsg
                .setColor("RED")
                .setDescription(":x: You have to give a command name and a response \n```" + prefix + "add [cmd name] [response]```")
            msg.reply({embeds:[embedMsg]})
            return
        }

        let cmdDataBase = await customCmdModel.findOne({ guildId: msg.guild.id, cmdName: command.toLowerCase() })
        // check if command name already exists
        if (cmdDataBase){
            embedMsg
                .setColor("RED")
                .setDescription(":exclamation: **" + command.toLowerCase() + "** already exists")
            msg.reply({embeds:[embedMsg]})
            return
        }

        let newCustomCommand = new customCmdModel({
            guildId: msg.guild.id,
            cmdName: command.toLowerCase(),
            response: response
        });
        await newCustomCommand.save();

        embedMsg
                .setColor("GREEN")
                .setDescription(":white_check_mark: **"+prefix + command.toLowerCase() + "** has been added successfully!")
        msg.channel.send({embeds:[embedMsg]})
        
        return
    },
};