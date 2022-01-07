const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const prefix = require('../../data/prefix.json');

module.exports = {
    name: 'del',
    description: 'Delete a custom command',
    execute(msg, args) {
        var embedMsg = new MessageEmbed();

        if(!msg.member.permissions.has("ADMINISTRATOR")) {
            embedMsg
                .setColor("RED")
                .setDescription(":no_entry_sign: Ты недостойный.")
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

        let cmdDataBase = db.get(`cmd_${msg.guild.id}`)

        if (!cmdDataBase){
            embedMsg
                .setColor("RED")
                .setDescription(":x: There was a problem loading the database.")
            msg.reply({embeds:[embedMsg]})
            return
        }
        // check if the command that the user wants to delete is in the database
        let command = cmdDataBase.find(x => x.name === deleteCommand.toLowerCase())
        if (!command){
            embedMsg
            .setColor("RED")
            .setDescription(":x: Could not find this command")
            msg.reply({embeds:[embedMsg]})
            return
        }
        
        // delete the command
        let index = cmdDataBase.indexOf(command);
        delete cmdDataBase[index];

        // remove all null values and update the database
        var filteredData = cmdDataBase.filter(x => {
            return x != null && x != ''
        })
        db.set(`cmd_${msg.guild.id}`, filteredData)
        
        embedMsg
            .setColor("GREEN")
            .setDescription(":white_check_mark: **"+prefix + deleteCommand.toLowerCase() + "** has been deleted!")
        msg.reply({embeds:[embedMsg]})

        return

    }
};