const r6API = require('../api_methods/r6/default');
const endpoints = require('../api_methods/r6/ubiapi')


describe("Unit testing - Ubisoft API", function () {
    let existingPlayer = "KD0."
    let nonExistingPlayer = "çava"

    /* ****************************** */
    
    it("should find existing player -> sends a result", async function () {
        const result = await r6API.findPlayer(existingPlayer);
        expect(result).toBeDefined();
    });

    it("should not find the player -> sends a notification", async function () {
        const result = await r6API.findPlayer(nonExistingPlayer);
        expect(result).toBeDefined();
    });

    it("should not find the player (no nickname)", async function () {
        const result = await r6API.findPlayer("");
        expect(result).toBeUndefined();
    });

    /* ****************************** */

    it("should send a summary of player's seasonal ranked stats", async function () {
        const result = await r6API.getSeasonalRankedSummary(existingPlayer);
        expect(result).toBeDefined();
    });

    it("should not find stats for inexistent player: notified", async function () {
        const result = await r6API.getSeasonalRankedSummary(nonExistingPlayer);
        expect(result).toBeDefined();
    });

    it("should not find the player (no nickname)", async function () {
        const result = await r6API.getSeasonalRankedSummary("");
        expect(result).toBeDefined();
    });

    /* ****************************** */

    it("should send an advanced report of player's seasonal ranked stats", async function () {
        const result = await r6API.getSeasonalRankedStats(existingPlayer);
        expect(result).toBeDefined();
    });

    it("should not find stats for inexistent player: notified", async function () {
        const result = await r6API.getSeasonalRankedStats(nonExistingPlayer);
        expect(result).toBeDefined();
    });

    it("should not find any stats (no nickname)", async function () {
        const result = await r6API.getSeasonalRankedStats("");
        expect(result).toBeDefined();
    });

    /* ****************************** */

    it("should send a summary of player's seasonal casual stats", async function () {
        const result = await r6API.getSeasonalCasualStats(existingPlayer);
        expect(result).toBeDefined();
    });
    

    it("should not find stats for inexistent player: notified", async function () {
        const result = await r6API.getSeasonalCasualStats(nonExistingPlayer);
        expect(result).toBeDefined();
    });

    it("should not find any stats (no nickname)", async function () {
        const result = await r6API.getSeasonalCasualStats("");
        expect(result).toBeDefined();
    });

    /* ****************************** */
    
});
