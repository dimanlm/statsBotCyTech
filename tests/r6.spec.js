const r6API = require('../api_methods/r6/default');


describe("Unit testing - Ubisoft API", function () {
    let existingPlayer = "KD0."
    let nonExistingPlayer = "çava"
    
    it("should find existing player -> sends a result", async function () {
        const result = await r6API.findPlayer(existingPlayer);
        expect(result).toBeDefined();
    });

    it("should not find the player -> sends a notification", async function () {
        const result = await r6API.findPlayer(nonExistingPlayer);
        expect(result).toBeDefined();
    });

});
