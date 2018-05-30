var Player = require('../models/players');
var Result = require('../models/results');
const uuidv1 = require('uuid/v1');
var moment = require('moment');
var jwt = require('jsonwebtoken');

exports.login = function(req, res, next) {
    var newPlayer;
    if (!req.body.id) {
        return next(new Error('id is required'));
    }
    
    Player.findOne({id:req.body.id}, function(err,player) {
        if (!err) {
            var payLoad = {
                id: req.body.id,
                last_login: moment()
            }
            var token = jwt.sign(payLoad,(process.env.SECRET_KEY)?process.env.SECRET_KEY:'thisisakey');
            if (player){
                player.token = token;
                newPlayer = player;
                Player.update({
                    _id:player._id,
                    last_login:payLoad.last_login
                }, player, function(err,num) {
                    res.send(newPlayer);
                });
            }else{
                Player.create({
                    id: req.body.id,
                    name: req.body.name,
                    token: token,
                    score: 0,
                    play: 0,
                    right_score: 0,
                    right_result: 0,
                    wrong_result: 0,                    
                    last_login:payLoad.last_login
                }, function (err, player) {
                    if (!err) {
                        newPlayer = player;
                        res.send(newPlayer);
                    }
                });
            }
        }
    });
};

exports.getPlayerRank = async function(req, res, next) {
    if (!req.payLoad.id) {
        return next(new Error('payLoad.id is required'));
    }
    
    var players = await Player.find({}).sort({score:-1}).exec();
    var myplayer = players.find((player)=>{
        return player.id===req.payLoad.id;
    })
    var seqNo = 0;
    return {
        id: myplayer.id,
        name: myplayer.name,
        score: myplayer.score,
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

exports.updateResult = async function(req, res, next) {
    if (!req.payLoad.id) {
        return next(new Error('payLoad.id is required'));
    }
    if (!req.body.match_no) {
        return next(new Error('match_no is required'));
    }
    if (!req.body.home_score) {
        return next(new Error('home_score is required'));
    }
    if (!req.body.away_score) {
        return next(new Error('away_score is required'));
    }
    
    var result = await Result.findOneAndUpdate({
        id: req.payLoad.id,
        match_no: req.body.match_no
    },{
        home_score: req.body.home_score,
        away_score: req.body.away_score
    },{upsert: true, 'new': true}).exec();
    
    res.send({
        id: result.id,
        match_no: result.match_no,
        home_score: result.home_score,
        away_score: result.away_score
    });
};

exports.getPlayerInfo = function(req, res, next) {
    if (!req.payLoad.id) {
        return next(new Error('payLoad.id is required'));
    }
    if (!req.query.player_id) {
        return next(new Error('player_id is required'));
    }
    return {
        id: req.query.player_id
    }
};
