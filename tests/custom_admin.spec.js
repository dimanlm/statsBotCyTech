require('dotenv').config();

import { MessageEmbed } from "discord.js";
import execute from '../src/commands/custom-commands/add';
const mongoose = require('mongoose');
const customCmdModel = require('../src/models/customCmdSchema')
const prefix = require('../src/config/prefix.json')

describe("Admin -> Managing custom commands", function () {
    // message parameter initialization
    var adminMessage = {
        channel: {
            send: jest.fn()
        },
        content: "",
        guild: {
            id: ""
        },
        author: {
            bot: false
        },
        member: {
            permissions: {
                has: jest.fn().mockReturnValue(true) // has administrator permissions
            }
        },
    };

    function successfullyAdded(command) {
        return (new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(":white_check_mark: **"+ prefix + command.toLowerCase() + "** has been added successfully!"))
    };
    
    function invalidFormat() {
        return (new MessageEmbed()
                    .setColor("RED")
                    .setDescription(":x: You have to give a command name and a response \n```" + prefix + "add [cmd name] [response]```"));
    }

    function alreadyExists(command) {
        return (new MessageEmbed()
                    .setColor("RED")
                    .setDescription(":exclamation: **" + command.toLowerCase() + "** already exists"));
    }

    var command = 'hello'
    var response = 'world'

    // connecting to mongodb
    beforeAll(async () => {
        await mongoose.connect(process.env.URI, {
            keepAlive: true
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fail: invalid format", async () => {
        adminMessage.reply = jest.fn();
        adminMessage.content = "$add" + command;
        adminMessage.guild.id = "1000";
        await execute.execute(adminMessage, [command]);
        expect(adminMessage.reply).toHaveBeenCalledWith({embeds:[invalidFormat()]});
    });

    it("should add the custom command '$hello'", async () => {
        adminMessage.reply = jest.fn();
        adminMessage.content = "$add" + command + response;
        adminMessage.guild.id = "1000";
        await execute.execute(adminMessage, [command, response]);
        expect(adminMessage.channel.send).toHaveBeenCalledWith({embeds:[successfullyAdded(command)]});
    });

    it("should fail: the command already exists", async () => {
        adminMessage.reply = jest.fn();
        adminMessage.content = "$add" + command + response;
        adminMessage.guild.id = "1000";
        await execute.execute(adminMessage, [command, response]);
        expect(adminMessage.reply).toHaveBeenCalledWith({embeds:[alreadyExists(command)]});
    });

    it("should add the command '$hello', but on a different server", async () => {
        adminMessage.reply = jest.fn();
        var response = 'World!'
        adminMessage.content = "$add" + command + response;
        adminMessage.guild.id = "1001";
        await execute.execute(adminMessage, [command, response]);
        expect(adminMessage.channel.send).toHaveBeenCalledWith({embeds:[successfullyAdded(command)]});
    });

    it("should edit the response of '$hello'", async () => {
        adminMessage.reply = jest.fn();
        var change = 'Mundo!'
        adminMessage.content = "$edit" + "res" + command + change;
        adminMessage.guild.id = "1001";
        await execute.execute(adminMessage, [command, response]);
        expect(adminMessage.channel.send).toBeDefined();
    });

    it("should edit the name of '$hello' to '$hola'", async () => {
        adminMessage.reply = jest.fn();
        var change = 'hola'
        adminMessage.content = "$edit" + "name" + command + change;
        adminMessage.guild.id = "1001";
        await execute.execute(adminMessage, [command, response]);
        expect(adminMessage.channel.send).toBeDefined();
    });

    it("should delete the command '$hola'", async () => {
        adminMessage.reply = jest.fn();
        var change = 'hola'
        adminMessage.content = "$del" + change;
        adminMessage.guild.id = "1001";
        await execute.execute(adminMessage, [change, response]);
        expect(adminMessage.channel.send).toBeDefined();
    });

    it("should not delete an inexistent command", async () => {
        adminMessage.reply = jest.fn();
        adminMessage.content = "$del" + command;
        adminMessage.guild.id = "1001";
        await execute.execute(adminMessage, [command, response]);
        expect(adminMessage.channel.send).toBeDefined();
    });


    // closing the connection
    afterAll(async () => {
        // delete the test commands
        await customCmdModel.findOneAndDelete({ guildId: "1000", cmdName: 'hello' });
        await customCmdModel.findOneAndDelete({ guildId: "1001", cmdName: 'hello' });

        mongoose.connection.close();
    })

});