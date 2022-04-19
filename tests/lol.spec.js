const lolAPI = require('../src/api_methods/lol/default');
const summonerCommand = require('../src/commands/lol-stats/summoner');
const championsCommand = require('../src/commands/lol-stats/champions');
const masteryCommand = require('../src/commands/lol-stats/mastery');

describe("Unit testing - League of Legents API", function () {    
        it("Summoner", async function () {
            const summoner = await lolAPI.summoner('CyTech');
            expect(summoner).toBeDefined();
        });
    
        it("Champions", async function () {
            const champs = await lolAPI.champions();
            expect(champs).toBeDefined();
        });

        it("Mastery", async function () {
            const mastery = await lolAPI.mastery('CyTech');
            expect(mastery).toBeDefined();
        });

        it("Mastery", async function () {
            const mastery = await lolAPI.mastery( );
            expect(mastery).toBeDefined();
        });
});

describe("Testing League of Legends commands", function () {
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

    it("$sum - existing player: should be defined", async () => {
        msg.reply = jest.fn();
        msg.content = "$sum";
        let args = ["123"];
        await summonerCommand.execute(msg, args);
        expect(msg.reply).toBeDefined();
    });

    it("$sum - inexistent player: should be defined", async () => {
        msg.reply = jest.fn();
        msg.content = "$sum";
        let args = ["___"];
        await summonerCommand.execute(msg, args);
        expect(msg.reply).toBeDefined();
    });

    it("$sum - undefined player: should send a message about it", async () => {
        msg.reply = jest.fn();
        msg.content = "$sum";
        let args = [];
        await summonerCommand.execute(msg, args);
        expect(msg.reply).toBeDefined();
    });

    it("$champs - sends a list of champions: should be defined", async () => {
        msg.reply = jest.fn();
        msg.content = "$champs";
        await championsCommand.execute(msg);
        expect(msg.reply).toBeDefined();
    });

    it("$mastery - existing player: should be defined", async () => {
        msg.reply = jest.fn();
        msg.content = "$mastery";
        let args = ["CyTech"];
        await masteryCommand.execute(msg, args);
        expect(msg.reply).toBeDefined();
    });

    it("$mastery - inexistent player: should be defined", async () => {
        msg.reply = jest.fn();
        msg.content = "$mastery";
        let args = ["_ç_ç_ç"];
        await masteryCommand.execute(msg, args);
        expect(msg.reply).toBeDefined();
    });

    it("$mastery - undefined player: should not crash", async () => {
        msg.reply = jest.fn();
        msg.content = "$mastery";
        let args = [];
        await masteryCommand.execute(msg, args);
        expect(msg.reply).toBeDefined();
    });

});
