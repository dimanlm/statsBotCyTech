import { MessageEmbed } from "discord.js";
require('dotenv').config();
import execute from '../commands/custom-commands/add';
const mongoose = require('mongoose');

describe("Custom commands - not admin user", function () {
    // message initialization
    var notAdminMessage = {
        channel: {
            send: jest.fn()
        },
        content: "",
        author: {
            bot: false
        },
        guild: {
            // test server id
            id: "1000"
        },
        member: {
            permissions: {
                has: jest.fn().mockReturnValue(false) // no administrator permissions
            },
        },
    };

    var embedMsg = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(":no_entry_sign: You don't have permission to add a custom command.");

    // connecting to mongodb
    beforeAll(async () => {
        await mongoose.connect(process.env.URI);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });


    it("should refuse to add -> insufficient permissions", async () => {
        var command = 'hello'
        var response = 'world'
        notAdminMessage.reply = jest.fn();
        notAdminMessage.content = "$add" + command + response;
        await execute.execute(notAdminMessage, [command, response]);
        expect(notAdminMessage.reply).toHaveBeenCalledWith({embeds:[embedMsg]});
    });

    it("should refuse delete a command -> insufficient permissions", async () => {
        var command = 'hello'
        notAdminMessage.reply = jest.fn();
        notAdminMessage.content = "$del" + command;
        await execute.execute(notAdminMessage, [command]);
        expect(notAdminMessage.reply).toHaveBeenCalledWith({embeds:[embedMsg]});
    });

    it("should refuse to edit a command -> insufficient permissions", async () => {
        var command = 'hello'
        notAdminMessage.reply = jest.fn();
        notAdminMessage.content = "$edit" + command;
        await execute.execute(notAdminMessage, [command]);
        expect(notAdminMessage.reply).toHaveBeenCalledWith({embeds:[embedMsg]});
    });


    // closing the connection
    afterAll(() => {
        mongoose.connection.close();
    })

});