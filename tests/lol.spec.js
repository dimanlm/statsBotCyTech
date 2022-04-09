require('dotenv').config();

const lolAPI = require('../api_methods/lol/default');
const summonerCommand = require('../commands/lol-stats/summoner');
const championsCommand = require('../commands/lol-stats/champions');


describe("Testing API requests", function () {    
        it("Summoner", async function () {
            const summoner = await lolAPI.summoner('CyTech');
            expect(summoner).toBeDefined();
        });
    
        it("Champions", async function () {
            const champs = await lolAPI.champions();
            expect(champs).toBeDefined();
        });
});

describe("Testing commands", function () {
    // message initialization
    var msg = {
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
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("$sum - should find a player", async () => {
        msg.reply = jest.fn();
        msg.content = "$sum";
        let args = ["123"];
        await summonerCommand.execute(msg, args);
        expect(msg.reply).toBeDefined();
    });

    it("$sum - shouldnot find a player", async () => {
        msg.reply = jest.fn();
        msg.content = "$sum";
        let args = ["___"];
        await summonerCommand.execute(msg, args);
        expect(msg.reply).toBeDefined();
    });

    it("$champs - should send a list of champions", async () => {
        msg.reply = jest.fn();
        msg.content = "$champs";
        await championsCommand.execute(msg);
        expect(msg.reply).toBeDefined();
    });

});
