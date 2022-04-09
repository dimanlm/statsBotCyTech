// import { Message, MessageEmbed } from "discord.js";
require('dotenv').config();
import execute from '../commands/custom-commands/add';
const mongoose = require('mongoose');

describe("Custom commands - admin", function () {
    // message initialization
    var adminMessage = {
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
                has: jest.fn().mockReturnValue(true), // has administrator permissions
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

    it("should refuse to add a -> $hi already exists", async () => {
        adminMessage.reply = jest.fn();
        var command = 'hi'
        var response = 'bye'
        adminMessage.content = "$add" + command + response;
        await execute.execute(adminMessage, [command, response]);
        expect(adminMessage.reply).toHaveBeenCalledWith(":exclamation: **" + command.toLowerCase() + "** already exists");
    });

    // closing the connection
    afterAll(async () => {
        mongoose.connection.close()
    })

});