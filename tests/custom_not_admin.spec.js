// import { Message, MessageEmbed } from "discord.js";
require('dotenv').config();
import execute from '../commands/custom-commands/add';
const mongoose = require('mongoose');

describe("Custom commands - not admin user", function () {
    // message initialization
    var notAdminMessage = {
        channel: {
            send: jest.fn(),
        },
        content: "",
        author: {
            bot: false,
        },
        guild: {
            // test server id
            id: "945659754158620792"
        },
        member: {
            permissions: {
                has: jest.fn().mockReturnValue(false), // no administrator permissions
            },
        },

    };

    // connecting to mongodb
    beforeAll(async () => {
        await mongoose.connect(process.env.URI, {
            keepAlive: true
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should refuse to add", async () => {
        var command = 'hi'
        var response = 'bye'
        notAdminMessage.reply = jest.fn();
        notAdminMessage.content = "$add" + command + response;
        await execute.execute(notAdminMessage, [command, response]);
        expect(notAdminMessage.reply).toHaveBeenCalledWith(":no_entry_sign: You don't have permission to add a custom command.");
    });

    // closing the connection
    afterAll(async () => {
        mongoose.connection.close()
    })

});