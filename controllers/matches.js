var _ = require('underscore');
var moment = require('moment');
var Match = require('../models/matches');
var Result = require('../models/results');
var resultController = require('./results');

exports.getMatches = async function(req, res, next) {
    if (!req.payLoad.id) {
        return next(new Error('payLoad.id is required'));
    }

    var matchs = await Match.find({}).sort({match_no:1}).exec();
    var results = await Result.find({
        id:req.payLoad.id
    }).sort({match_no:1}).exec();

    return matchs.map((match)=>{
        var result = results.find((result)=>{
            return result.match_no===match.match_no;
        });
        return {
            match_no: match.match_no,
            match_type: this.getMatchTypeDesc(match.match_type),
            match_day: match.match_day,
            start_timestamp: match.start_timestamp,
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
            result_type: resultController.getResultType(match,result)
        }
    })
};

exports.getMatchInfo = async function(req, res, next) {
    if (!req.payLoad.id) {
        return next(new Error('payLoad.id is required'));
    }

    var match = await Match.findOne({
        match_no: req.query.match_no
    }).exec();
    var result = await Result.findOne({
        match_no: req.query.match_no,
        id: req.payLoad.id
    }).exec();
    match.match_type = this.getMatchTypeDesc(match.match_type);
    if (result) {
        match.result = {
            home_score: result.home_score,
            away_score: result.away_score
        }
    }
    match.can_save = moment().isBefore(match.start_timestamp)
    return match;
};

exports.getMatchTypeDesc = function(match_type) {
    if (_.contains(['A','B','C','D','E','F','G','H'],match_type)) {
        return 'Group ' + match_type;
    } else if ( match.match_type==='2' ) {
        return 'Round of 16';
    } else if ( match.match_type==='Q' ) {
        return 'Quarter Finals';
    } else if ( match.match_type==='S' ) {
        return 'Semi-Finals';
    } else if ( match.match_type==='3' ) {
        return '3rd Place';
    } else if ( match.match_type==='F' ) {
        return 'Final';
    }
    return '';
}
