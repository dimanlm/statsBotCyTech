// Here we send custom requests to Ubisoft's public API
const auth_1 = require('../../../node_modules/r6api.js/dist/auth');
var axios = require('axios');
const { SEASON_RELEASE } = require("../../../data/default.json");

let date_ob = new Date();

// current date
let today = date_ob.getFullYear() + ("0" + (date_ob.getMonth() + 1)).slice(-2) +  ("0" + date_ob.getDate()).slice(-2);

module.exports = {
    getSeasonalOperators: async function(p){
        var config = {
            method: 'get',
            url: `https://r6s-stats.ubisoft.com/v1/current/operators/${p}?gameMode=all,ranked,casual,unranked&platform=PC&teamRole=attacker,defender&startDate=${SEASON_RELEASE}&endDate=${today}`,
            headers: { 
                // getting the parameters from the session
                'Ubi-SessionId': (await auth_1.getAuth()).sessionId, 
                'Authorization': 'ubi_v1 t='+ (await auth_1.getAuth()).ticket,
                'expiration': (await auth_1.getAuth()).expiration
            }
        };

        let res = await axios(config)
                    .then(function (response) {
                    return response.data;
                    })
                    .catch(function (error) {
                    console.log(error);
                    });
        
        return res;
    },

    getUnrankedStats: async function(p){
        var config = {
            method: 'get',
            url: `https://r6s-stats.ubisoft.com/v1/seasonal/summary/${p}?gameMode=unranked&platform=PC`,
            headers: { 
                // getting the parameters from the session
                'Ubi-SessionId': (await auth_1.getAuth()).sessionId, 
                'Authorization': 'ubi_v1 t='+ (await auth_1.getAuth()).ticket,
                'expiration': (await auth_1.getAuth()).expiration
            }
        };

        let res = await axios(config)
                    .then(function (response) {
                    return response.data;
                    })
                    .catch(function (error) {
                    console.log(error);
                    });
        return res;
    }
    
}

/** Examples
 *          let operators = await ubi.getSeasonalOperators(player[0].id)
            //console.log(operators.platforms.PC.gameModes.all)
            let attackerArray = operators.platforms.PC.gameModes.all.teamRoles.attacker;
            let defenderArray = operators.platforms.PC.gameModes.all.teamRoles.defender;

            let mostPopularAttacker = attackerArray[0]
            for (let i = 0; i < attackerArray.length; i++){
                if (attackerArray[i].minutesPlayed > mostPopularAttacker.minutesPlayed) mostPopularAttacker=attackerArray[i];
            }

            let mostPopularDefender = defenderArray[0]
            for (let i = 0; i < defenderArray.length; i++){
                if (defenderArray[i].minutesPlayed > mostPopularDefender.minutesPlayed) mostPopularDefender=defenderArray[i];
            }
            console.log(username + "'s most played operator this season is: " + mostPopularAttacker.statsDetail + '(' + (mostPopularAttacker.minutesPlayed/60).toFixed(2) + 'h) and ' + mostPopularDefender.statsDetail + '(' + (mostPopularDefender.minutesPlayed/60).toFixed(2) + 'h)')


            let unranked = await ubi.getUnrankedStats(player[0].id)
            let unrankedArray = unranked.platforms.PC.gameModes.unranked.teamRoles.all
            let unrankedPlaytime = 0
            for (let i=0; i < unrankedArray.length; i++){
                unrankedPlaytime+=unrankedArray[i].minutesPlayed
            }
            console.log(unrankedPlaytime/60)
 */