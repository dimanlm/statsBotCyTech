const customCmdModel = require('../../models/customCmdSchema');
const { MessageEmbed } = require('discord.js');
const prefix = require('../../config/prefix.json');

module.exports = {
    name: 'del',
    description: 'Delete a custom command',
    async execute (msg, args) {
        var embedMsg = new MessageEmbed();

        if(!msg.member.permissions.has("ADMINISTRATOR")) {
            embedMsg
                .setColor("RED")
                .setDescription(":no_entry_sign: You don't have permission to delete a command.")
            msg.reply({embeds:[embedMsg]})
            return
        }
        
        let deleteCommand = args[0];
        // check if the user has written the command that will be deleted
        if(!deleteCommand){
            embedMsg
                .setColor("RED")
                .setDescription(":x: What command do you want to delete?\n ```" +prefix+ "del [cmd name]```\n`" +prefix +"help` to see the list of all available commands.")
            msg.reply({embeds:[embedMsg]})
            return
        }

        let cmdDataBase = await customCmdModel.findOne({ guildId: msg.guild.id, cmdName: deleteCommand.toLowerCase() });

        // check if the command that the user wants to delete is in the database
        if (!cmdDataBase){
            embedMsg
            .setColor("RED")
            .setDescription(":x: This command does not exist.")
            msg.reply({embeds:[embedMsg]})
            return
        }
        
        // search for the command and delete it
        await customCmdModel.findOneAndDelete({ guildId: msg.guild.id, cmdName: deleteCommand.toLowerCase() });

        embedMsg
            .setColor("GREEN")
            .setDescription(":white_check_mark: **"+prefix + deleteCommand.toLowerCase() + "** has been deleted!")
        msg.channel.send({embeds:[embedMsg]})

        return

    }
};