var Player = require('../models/players');
var Match = require('../models/matches');
var Result = require('../models/results');
var moment = require('moment');
var _ = require('underscore');

exports.updateResult = async function(req, res) {
    if (!req.payLoad.id) {
        throw new Error('payLoad.id is required');
    }
    if (!req.body.match_no) {
        throw new Error('match_no is required');
    }
    if (!req.body.home_score) {
        throw new Error('home_score is required');
    }
    if (!req.body.away_score) {
        throw new Error('away_score is required');
    }
    
    var result = await Result.findOneAndUpdate({
        id: req.payLoad.id,
        match_no: req.body.match_no
    },{
        home_score: req.body.home_score,
        away_score: req.body.away_score
    },{upsert: true, 'new': true}).exec();
    
    return {
        id: result.id,
        match_no: result.match_no,
        home_score: result.home_score,
        away_score: result.away_score
    }
};

var scoreConfig = [];
scoreConfig['A'] = [0,5,2,1];
scoreConfig['B'] = [0,5,2,1];
scoreConfig['C'] = [0,5,2,1];
scoreConfig['D'] = [0,5,2,1];
scoreConfig['E'] = [0,5,2,1];
scoreConfig['F'] = [0,5,2,1];
scoreConfig['G'] = [0,5,2,1];
scoreConfig['H'] = [0,5,2,1];
scoreConfig['2'] = [0,7,3,1];
scoreConfig['Q'] = [0,9,4,1];
scoreConfig['S'] = [0,11,5,1];
scoreConfig['3'] = [0,13,6,1];
scoreConfig['F'] = [0,15,7,1];

exports.calcMatch = async function(req, res) {
    if (!req.body.match_no) {
        throw new Error('match_no is required');
    }
    
    // Calculate by match
    //     select a match by match_no (must have score)
    //         select result by a match_no (every player)
    //         calc score
    //         put score in result
    var match = await Match.findOne({
        match_no: req.body.match_no,
        home_score: {
            $exists: true
        }
    }).exec();
    
    if (!match) {
        throw new Error("Match " + req.body.match_no + " not found");
    }

    var results = await Result.find({
        match_no: req.body.match_no
    }).exec();

    if (results.length==0) {
        throw new Error("Result by match " + req.body.match_no + " not found");
    }

    for (let result of results) {
        if ( result.home_score===match.home_score && 
                result.away_score===match.away_score) {
            result.right_score = 1;
            result.right_result = 0;
            result.wrong_result = 0;
            result.score = scoreConfig[match.match_type][1];
        } else {
            if (result.home_score > result.away_score && 
                    match.home_score > match.away_score) {
                result.right_score = 0;
                result.right_result = 1;
                result.wrong_result = 0;
                result.score = scoreConfig[match.match_type][2];
            } else if (result.home_score===result.away_score && 
                            match.home_score===match.away_score) {
                result.right_score = 0;
                result.right_result = 1;
                result.wrong_result = 0;
                result.score = scoreConfig[match.match_type][2];
            } else if (result.home_score < result.away_score && 
                            match.home_score < match.away_score) {
                result.right_score = 0;
                result.right_result = 1;
                result.wrong_result = 0;
                result.score = scoreConfig[match.match_type][2];
            } else {
                result.right_score = 0;
                result.right_result = 0;
                result.wrong_result = 1;
                result.score = scoreConfig[match.match_type][3];
            }
        }
        
        await Result.update({
            _id: result._id
        },result).exec();
    }
};

exports.calcPlayer = async function(req, res) { 
    if (!req.body.player_id) {
        throw new Error('player id is required');
    }
    
    // Calculate by player
    //     select all match which have score
    //         select result by a player ( every match
    //         calc score
    //         put score in result
    console.log("calcPlayer");   
    
};

exports.calcAll = async function(req, res) { 
    // Calculate all
    //     select all match which have score
    //     select all result 
    //         calc score
    //         put score in result  
    console.log("calcAll");   
    
};

exports.sumScore = async function(req, res) {  
    console.log("sumPlayerScore");
    var results = await Result.aggregate([{
        $group: {
            _id: "$id",
            sum_score: { $sum: "$score"},
            sum_right_score: { $sum: "$right_score"},
            sum_right_result: { $sum: "$right_result"},
            sum_wrong_result: { $sum: "$wrong_result"}
        }
    }]).exec();
    
    for (let result of results) {
        var n = await Player.update({
            id: result._id
        },{
            score: result.sum_score,
            play: result.sum_right_score+result.sum_right_result+result.sum_wrong_result,
            right_score: result.sum_right_score,
            right_result: result.sum_right_result,
            wrong_result: result.sum_wrong_result
        }).exec();
    }
      
    console.log("sumMatchScore");    
    var results = await Result.aggregate([{
        $group: {
            _id: "$match_no",
            sum_score: { $sum: "$score"},
            sum_right_score: { $sum: "$right_score"},
            sum_right_result: { $sum: "$right_result"},
            sum_wrong_result: { $sum: "$wrong_result"}
        }
    }]).exec();
    
    for (let result of results) {
        var n = await Match.update({
            match_no: result._id
        },{
            sum_score: result.sum_score,
            sum_right_score: result.sum_right_score,
            sum_right_result: result.sum_right_result,
            sum_wrong_result: result.sum_wrong_result
        }).exec();
    }

    console.log("sumMatchPercent"); 
    var results2 = await Result.aggregate([
        {
            $project: {
                match_no: 1,
                home_score: 1,
                away_score: 1,
                home_win: { $cond: [ { $gt: [ '$home_score', '$away_score' ] }, 1, 0 ]},
                draw: { $cond: [ { $eq: [ '$home_score', '$away_score' ] }, 1, 0 ]},
                away_win: { $cond: [ { $lt: [ '$home_score', '$away_score' ] }, 1, 0 ]}
            }
        },{
            $group: {
                _id: "$match_no",            
                sum_home_win: { $sum: "$home_win"},
                sum_draw: { $sum: "$draw"},
                sum_away_win: { $sum: "$away_win"}
            }
        }
    ]).exec();  
    
    for (let result of results2) {
        var n = await Match.update({
            match_no: result._id
        },{
            sum_home_win: result.sum_home_win,
            sum_draw: result.sum_draw,
            sum_away_win: result.sum_away_win
        }).exec();
    }
};

exports.getResultType = function(match,result) {
    var result_type = 0;

    if ( result!=undefined && 
        result.home_score!=undefined && result.away_score!=undefined &&
        match.home_score!=undefined && match.away_score!=undefined ) {
        if ( result.home_score===match.home_score && 
            result.away_score===match.away_score) {
            // right score
            result_type = 1;
        } else {
            if (result.home_score > result.away_score && match.home_score > match.away_score) {
                result_type = 2;
            } else if (result.home_score===result.away_score && match.home_score===match.away_score) {
                result_type = 2;
            } else if (result.home_score < result.away_score && match.home_score < match.away_score) {
                result_type = 2;
            } else {
                result_type = 3;
            }
        }
    }
    return result_type
};