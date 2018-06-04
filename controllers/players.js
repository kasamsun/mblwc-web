var Player = require('../models/players');
var Match = require('../models/matches');
var Result = require('../models/results');
const uuidv1 = require('uuid/v1');
var moment = require('moment');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var matchController = require('./matches');
var resultController = require('./results');

exports.login = async function(req, res) {
    var newPlayer;
    if (!req.body.id) {
        throw new Error('id is required');
    }
    
    var player = await Player.findOne({id:req.body.id}).exec();
    if (player) {
        // Existing player
        var payLoad = {
            id: player.id,
            last_login: moment(),
            status: player.player_status
        }
        if (req.body.force_player_id) {
            var forcePlayer = await Player.findOne({
                id:req.body.force_player_id
            }).exec();
            if (!forcePlayer) {
                throw new Error('id not found');
            }
            payLoad.id = req.body.force_player_id;
        }
        var token = jwt.sign(payLoad,
            (process.env.SECRET_KEY)?process.env.SECRET_KEY:'thisisakey');
            player.token = token;
        player.last_login = payLoad.last_login;
        newPlayer = player;

        var p = await Player.update({
            _id:player._id
        }, player).exec();
        
        if (p.n>0) {
            console.log("Login " + newPlayer.id);
            return newPlayer;
        }
    } else {
        // New player
        var payLoad = {
            id: req.body.id,
            last_login: moment(),
            player_status: "A"
        }
        var token = jwt.sign(payLoad,
            (process.env.SECRET_KEY)?process.env.SECRET_KEY:'thisisakey');
        var player = Player.create({
            id: req.body.id,
            name: req.body.name,
            token: token,
            score: 0,
            play: 0,
            right_score: 0,
            right_result: 0,
            wrong_result: 0, 
            player_status: "A",                   
            last_login:payLoad.last_login
        });
        newPlayer = player;
        console.log("New player login " + player.id);
        return newPlayer;
    }
};

exports.getPlayerRankAndMatches = async function(req, res) {    
    var result = await this.getPlayerRank(req,res);
    var result2 = await matchController.getMatches(req,res);
    result.matches = result2;
    return result;
};

exports.getPlayerRank = async function(req, res) {
    if (!req.payLoad.id) {
        throw new Error('payLoad.id is required');
    }
    
    // PRODUCTION find with player status A
    var players = await Player.find({
        player_status:{
            $in:["A","D","M"]
        }
    }).sort({score:-1}).exec();
    var myplayer = players.find((player)=>{
        return player.id===req.payLoad.id;
    })
    var seqNo = 0;
    return {
        id: myplayer.id,
        name: myplayer.name,
        score: myplayer.score,
        play: myplayer.play,
        right_score: myplayer.right_score,
        right_result: myplayer.right_result,
        wrong_result: myplayer.wrong_result,
        fav_team: myplayer.fav_team,
        today: moment(),
        players: players.map((player) => {
            return {
                seq: ++seqNo,
                id: player.id,
                name: player.name,
                score: player.score,
                level: (seqNo<=1)?1:(seqNo<=2)?2:(seqNo<=3)?3:undefined
            }        
        })
    }
};

exports.getPlayerInfo = async function(req, res) {
    if (!req.payLoad.id) {
        throw new Error('payLoad.id is required');
    }
    if (!req.query.player_id) {
        throw new Error('player_id is required');
    }
    
    var player = await Player.findOne({
        id: req.query.player_id
    }).exec();
    
    if (!player) {
        throw new Error('player_id not found');
    }
    
    var matches = await Match.find({
        home_score: {
            $exists: true
        }
    }).sort({match_no:1}).exec();
    
    var maxMatch = undefined;
    if (matches.length>0) {
        maxMatch = matches[matches.length-1].match_no;
    }
    
    if (maxMatch) {
        
        var results = await Result.find({
            id:req.query.player_id,
            match_no: {
                $lte: maxMatch
            }
        }).sort({match_no:1}).exec();
    
        matches = matches.map((match)=>{
            var result = results.find((result)=>{
                return result.match_no===match.match_no;
            });        
            return {
                match_no: match.match_no,
                match_type: matchController.getMatchTypeDesc(match.match_type),
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
    } else {
        matches = matches.map((match)=>{
            return {
                match_no: match.match_no,
                match_type: matchController.getMatchTypeDesc(match.match_type),
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
                result_type: 0
            }
        });
    }
    
    return {
        id: req.query.player_id,
        name: player.name,
        score: player.score,
        right_score: player.right_score,
        right_result: player.right_result,
        wrong_result: player.wrong_result,
        fav_team: player.fav_team,
        fav_team_name: (player.fav_team)?this.getTeamName(player.fav_team):undefined,
        matches: matches
    }
};

exports.updatePlayer = async function(req, res) {
    if (!req.payLoad.id) {
        throw new Error('payLoad.id is required');
    }
    if (!req.body.fav_team) {
        throw new Error('fav_team is required');
    }

    var player = await Player.findOneAndUpdate({
        id: req.payLoad.id
    },{
        fav_team: req.body.fav_team
    },{upsert: false, 'new': true}).exec();
    
    return {
        id: req.payLoad.id,
        fav_team: req.body.fav_team
    }
};


var teamName = [];
teamName["RUS"] = "Russia";
teamName["URU"] = "Uruguay";
teamName["EGY"] = "Egypt";
teamName["KSA"] = "Saudi Arabia";
teamName["POR"] = "Portugal";
teamName["ESP"] = "Spain";
teamName["MAR"] = "Morocco";
teamName["IRN"] = "Iran";
teamName["FRA"] = "France";
teamName["PER"] = "Peru";
teamName["DEN"] = "Denmark";
teamName["AUS"] = "Australia";
teamName["ARG"] = "Argentina";
teamName["CRO"] = "Croatia";
teamName["NGA"] = "Nigeria";
teamName["ISL"] = "Iceland";
teamName["BRA"] = "Brazil";
teamName["SUI"] = "Switzerland";
teamName["CRC"] = "Costa Rica";
teamName["SRB"] = "Serbia";
teamName["GER"] = "Germany";
teamName["MEX"] = "Mexico";
teamName["SWE"] = "Sweden";
teamName["KOR"] = "South Korea";
teamName["BEL"] = "Belgium";
teamName["ENG"] = "England";
teamName["TUN"] = "Tunisia";
teamName["PAN"] = "Panama";
teamName["COL"] = "Columbia";
teamName["SEN"] = "Senegal";
teamName["POL"] = "Poland";
teamName["JPN"] = "Japan";
exports.getTeamName = function(team) {
    return teamName[team];
}
