const LolApi = require("twisted");
const Constants = require("twisted");
const { RIOT_API_KEY } = require("../../data/config.json");

const api = new LolApi()

async function execute() {
    console.log(await api.Summoner.getByName('Hide on bush', Constants.Regions.KOREA));
    return await api.Summoner.getByName('Hide on bush', Constants.Regions.KOREA);
}

module.exports = {
    name: 'summoner',
    description: "**OVERALL** LOL stats",
    execute
}