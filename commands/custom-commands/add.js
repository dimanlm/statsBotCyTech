const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const prefix = require('../../data/prefix.json');

module.exports = {
    name: 'add',
    description: 'Add a custom command',
    execute(msg, args) {
        var embedMsg = new MessageEmbed();

        if(!msg.member.permissions.has("ADMINISTRATOR")) {
            embedMsg
                .setColor("RED")
                .setDescription(":no_entry_sign: Ты недостойный.")
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

        let cmdDataBase = db.get(`cmd_${msg.guild.id}`)
        // check if command name already exists
        if (cmdDataBase && cmdDataBase.find(x => x.name === command.toLowerCase())){
            embedMsg
                .setColor("RED")
                .setDescription(":exclamation: **" + command.toLowerCase() + "** already exists")
            msg.reply({embeds:[embedMsg]})
            return
        }

        let data = {
            name: command.toLowerCase(),
            response: response
        }
        db.push(`cmd_${msg.guild.id}`, data)

        embedMsg
                .setColor("GREEN")
                .setDescription(":white_check_mark: **"+prefix + command.toLowerCase() + "** added successfully!")
        msg.reply({embeds:[embedMsg]})
        
        return

    },
};