// Here we send custom requests to Ubisoft's public API
const auth_1 = require('../../node_modules/r6api.js/dist/auth');
const utils_1 = require("../../node_modules/r6api.js/dist/utils.js");
const constants = require('../../node_modules/r6api.js/dist/constants');
var axios = require('axios');

const { PLATFORM, TOTAL_NUMBER_OF_SEASONS } = require("../../config/default.json");

let date_ob = new Date();

// current date
let today = date_ob.getFullYear() + ("0" + (date_ob.getMonth() + 1)).slice(-2) +  ("0" + date_ob.getDate()).slice(-2);

module.exports = {
    /**
     * 
     * @param {player's id} p 
     * @returns seasonal stats about operators
     */
    // needs to be fixed
    getSeasonalOperators: async function(seasonReleaseDate, p){
        // default date format example: 2021-11-30T00:00:00.000Z
        // we need: 20211130
        seasonReleaseDate = seasonReleaseDate.split('T')[0].replace(/-/g,'');
        var config = {
            method: 'get',
            url: `https://r6s-stats.ubisoft.com/v1/current/operators/${p}?gameMode=all,ranked,casual,unranked&platform=PC&teamRole=attacker,defender&startDate=${seasonReleaseDate}&endDate=${today}`,
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
    
    /**
     * 
     * @param {player's id} p 
     * @returns unranked overall stats
     */
    getUnrankedStats: async function(p){
        var unrankedStat=[];

        var config = {
            method: 'get',
            url: `https://r6s-stats.ubisoft.com/v1/seasonal/summary/${p}?gameMode=unranked,ranked&platform=PC`,
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
        if (res=='') return;
        let unranked = res.platforms.PC.gameModes.unranked.teamRoles;

        // get the play hours
        let unrankedPlaytime = 0
        for (let i of Object.keys(unranked.all)){
            unrankedPlaytime+=unranked.all[i].minutesPlayed
        }

        // get the wins/losses
        let wl = [0,0]
        for (let i of Object.keys(unranked.all)){
            wl[0]+=unranked.all[i].matchesWon;
            wl[1]+=unranked.all[i].matchesLost;
        }

        // get the kills/deaths
        let kd = [0,0]
        for (let i of Object.keys(unranked.all)){
            kd[0]+=unranked.all[i].kills;
            kd[1]+=unranked.all[i].death;
        }

        // get kills per match
        let kpm = kd[0]/(wl[0]+wl[1])

        // played hours, winloss ratio, kd ratio, kills per match
        unrankedStat.push((unrankedPlaytime/60), (wl[0]/wl[1]), (kd[0]/kd[1]), kpm)

        return unrankedStat;
    },

    /**
     * 
     * @param {player's id} p 
     * @returns 
     */
     getTheBestRank: async function(p){
        // Variable to get the ranks of all season ids
        let allSeasonRequest = "";
        for (let i=-1; Math.abs(i) <= TOTAL_NUMBER_OF_SEASONS; i--){
            if (Math.abs(i)!=TOTAL_NUMBER_OF_SEASONS) allSeasonRequest += i + ',';
            else allSeasonRequest += i;
        }

        var config = {
            method: 'get',
            url: `https://public-ubiservices.ubi.com/v1/spaces/${constants.SPACE_IDS[PLATFORM]}/sandboxes/OSBOR_PC_LNCH_A/r6karma/player_skill_records?board_ids=pvp_ranked&season_ids=${allSeasonRequest}&region_ids=${REGION}&profile_ids=${p}`,
            headers: { 
                // getting the parameters from the session
                'Authorization': 'ubi_v1 t='+ (await auth_1.getAuth()).ticket,
                'Ubi-AppId' : '3587dcbb-7f81-457c-9781-0e3f29f6f56a'
            }
        };

        let res = await axios(config)
                    .then(function (response) {
                    return response.data;
                    })
                    .catch(function (error) {
                    console.log(error);
                    });
                    
        var allMaxMMR = [];
        var rankName = '';
        for (let i=5; i < res.seasons_player_skill_records.length; i++){
            rankName = utils_1.getRankNameFromRankId(res.seasons_player_skill_records[i].regions_player_skill_records[0].boards_player_skill_records[0].players_skill_records[0].max_rank, i+1); 
            allMaxMMR.push({ "rank": rankName, "mmr":res.seasons_player_skill_records[i].regions_player_skill_records[0].boards_player_skill_records[0].players_skill_records[0].max_mmr });
        }
        
        return (allMaxMMR.reduce((max, rank) => max.mmr > rank.mmr ? max : rank));
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