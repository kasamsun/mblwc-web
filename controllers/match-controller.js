var _ = require('underscore');
var moment = require('moment');
var Match = require('../models/matches');
var Result = require('../models/results');
var Comment = require('../models/comments');
var resultController = require('./result-controller');

exports.getFinishAndUnfinishMatches = async function(req, res) {
    if (!req.payLoad.id) {
        throw new Error('payLoad.id is required');
    }

    var matches = await Match.find({}).sort({match_no:1}).exec();
    var results = await Result.find({
        id:req.payLoad.id
    }).sort({match_no:1}).exec();

    var temps =  matches.map((match)=>{
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
    });

    var unfinishMatches = _.filter(temps, function(item, index) {
        return (item.home_score===undefined);
    });

    var finishMatches = _.sortBy(_.filter(temps, function(item, index) {
        return (item.home_score!==undefined);
    }), function(item) {
        return -item.match_no;
    });

    return {
        finishMatches: finishMatches,
        unfinishMatches: unfinishMatches
    }
};

exports.getMatchInfo = async function(req, res) {
    if (!req.payLoad.id) {
        throw new Error('payLoad.id is required');
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
    match.can_save = moment().isBefore(match.start_timestamp);
    
    var play = match.sum_home_win+match.sum_draw+match.sum_away_win;
    if ( play>0 ) {
        var play = match.sum_home_win+match.sum_draw+match.sum_away_win;
        match.play = play;
        match.sum_home_win_perc = (match.sum_home_win * 100 / play).toFixed(0);
        match.sum_draw_perc = (match.sum_draw * 100 / play).toFixed(0);
        match.sum_away_win_perc = (match.sum_away_win * 100 / play).toFixed(0);
        match.sum_right_score_perc = (match.sum_right_score * 100 / play).toFixed(0);
        match.sum_right_result_perc = (match.sum_right_result * 100 / play).toFixed(0);
        match.sum_wrong_result_perc = (match.sum_wrong_result * 100 / play).toFixed(0);
    } else {
        match.play = 0;
        match.sum_home_win_perc = 0;
        match.sum_draw_perc = 0;
        match.sum_away_win_perc = 0;
        match.sum_right_score_perc = 0;
        match.sum_right_result_perc = 0;
        match.sum_wrong_result_perc = 0;
    }

    var comments = await Comment.find({
        match_no: req.query.match_no
    }).sort({submit_timestamp:-1}).exec();
    
    match.comments = comments;
    match.comments_len = comments.length;
    return match;
};

exports.getMatches = async function(req, res) {
    console.log("getMatches []");

    var matches = await Match.find({}).sort({match_no:1}).exec();

    var temps =  matches.map((match)=>{
        return {
            match_no: match.match_no,
            match_type: this.getMatchTypeDesc(match.match_type),
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
            away_score_pk: match.away_score_pk
        }
    });

    return temps;
};

exports.getTeamDetail = async function(req, res) {
    console.log("getTeamDetail [" + req.params.team + "]");

    var matches = await Match.find({
        $or: [ { home_team: req.params.team }, { away_team: req.params.team } ] 
    }).sort({start_timestamp:1}).exec();

    return matches.map((match)=>{
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
            away_score_pk: match.away_score_pk
        }
    });
};

exports.getMatchTypeDesc = function(match_type) {
    if (_.contains(['A','B','C','D','E','F','G','H'],match_type)) {
        return 'Group ' + match_type;
    } else if ( match_type==='2' ) {
        return 'Round of 16';
    } else if ( match_type==='Q' ) {
        return 'Quarter Finals';
    } else if ( match_type==='S' ) {
        return 'Semi-Finals';
    } else if ( match_type==='3' ) {
        return '3rd Place';
    } else if ( match_type==='1' ) {
        return 'Final';
    }
    return '';
}
