var Match = require('../models/matches');
var Result = require('../models/results');

exports.getMatches = async function(req, res) {
    if (!req.query.id) {
        throw new Error("id is required");
    }

    var matchs = await Match.find({}).sort({match_no:1}).exec();
    var results = await Result.find({id:req.query.id}).sort({match_no:1}).exec();

    return matchs.map((match)=>{
        var result = results.find((result)=>{
            return result.match_no===match.match_no;
        });
        var result_type = 0;
        if (match.home_score==undefined) {
            // no match result
            result_type = 0;
        } else if (!result) {
            // no player result
            result_type = 1;
        } else if (result.home_score===match.home_score && result.away_score===match.away_score) {
            // right score
            result_type = 2;
        } else {
            if (result.home_score > result.away_score && match.home_score > match.away_score) {
                result_type = 3;
            } else if (result.home_score===result.away_score && match.home_score===match.away_score) {
                result_type = 3;
            } else if (result.home_score < result.away_score && match.home_score < match.away_score) {
                result_type = 3;
            } else {
                result_type = 4;
            }
        }
        return {
            match_no: match.match_no,
            group: match.group,
            match_day: match.match_day,
            start_timestamp: match.timestamp,
            home_team: match.home_team,
            away_team: match.away_team,
            home_team_name: match.home_team_name,
            away_team_name: match.away_team_name,
            home_score: match.home_score,
            away_score: match.away_score,
            home_score_120: match.home_score_120,
            away_score_120: match.away_score_120,
            home_score_pk: match.home_score_pk,
            away_score_pk: match.away_score_pk,
            result_home_score:(result)?result.home_score:undefined,
            result_away_score:(result)?result.away_score:undefined,
            result_type: result_type
        }
    })
};

