const customCmdModel = require('../../models/customCmdSchema');
const { MessageEmbed } = require('discord.js');
const prefix = require('../../data/prefix.json');

module.exports = {
    name: 'edit',
    description: 'Edit a custom command',
    async execute (msg, args) {
        var embedMsg = new MessageEmbed();

        if(!msg.member.permissions.has("ADMINISTRATOR")) {
            embedMsg
                .setColor("RED")
                .setDescription(":no_entry_sign: Ты недостойный.")
            msg.reply({embeds:[embedMsg]})
            return
        }
        
        let choise = args[0];
        let command = args[1];
        let modification = args.slice(2).join(' ');
        // check if the user has written the command that will be deleted
        if(!command){
            embedMsg
                .setColor("RED")
                .setDescription(":x: You have to enter a command that you want to edit\n ```" +prefix+ "edit [name/res] [cmd name] [modification]```")
                .setFooter("name: if you want to change the name of the command\nres: if you want to change the response")
            msg.reply({embeds:[embedMsg]})
            return
        }

        let cmdDataBase = await customCmdModel.findOne({ guildId: msg.guild.id, cmdName: command.toLowerCase() });

        // check if the command that the user wants to delete is in the database
        if (!cmdDataBase){
            embedMsg
            .setColor("RED")
            .setDescription(":x: This command does not exist. Remember the format:\n```" +prefix+ "edit [name/res] [cmd name] [modification]```")
            .setFooter("name: if you want to change the name of the command\nres: if you want to change the response")
            msg.reply({embeds:[embedMsg]})
            return
        }
        
        // search for the command and delete it
        switch (choise){

            // change command's name
            case 'name':
                // reject the new command name if there are spaces
                if (modification.indexOf(' ') >= 0){
                    embedMsg
                    .setColor("RED")
                    .setDescription(":x: Please enter a name without spaces.")
                    msg.reply({embeds:[embedMsg]})
                    return
                }
                await customCmdModel.findOneAndUpdate({ guildId: msg.guild.id, cmdName: command.toLowerCase() }, 
                {
                    $set:{
                        cmdName: modification.toLowerCase()
                    }     
                });
                var updateMsg = "**"+prefix + command.toLowerCase() + "** has been changed to **"+prefix + modification.toLowerCase() + "**.";
                break;

            //change command's response
            case 'res':
                await customCmdModel.findOneAndUpdate({ guildId: msg.guild.id, cmdName: command.toLowerCase() }, 
                {
                    $set:{
                        response: modification
                    }   
                });
                var updateMsg = "**"+prefix + command.toLowerCase() + "**'s response has been changed."
                break;

            // send an instruction for a correct request
            default:
                embedMsg
                .setColor("RED")
                .setDescription(":x: You have to enter a command that you want to edit\n ```" +prefix+ "edit [name/res] [cmd name] [modification]```")
                .setFooter("name: if you want to change the name of the command\nres: if you want to change the response")
                msg.reply({embeds:[embedMsg]})
                return
        }

        embedMsg
            .setColor("GREEN")
            .setDescription(":white_check_mark: " + updateMsg)
        msg.channel.send({embeds:[embedMsg]})

        return

    }
};