var Player = require('../models/players');
const uuidv1 = require('uuid/v1');

exports.login = function(req, res) {
    var newPlayer;
    if (!req.body.id) {
        throw new Error("id is required");
    }
    
    Player.findOne({id:req.body.id}, function(err,player) {
        if (!err) {
            if (player){
                player.token = uuidv1();
                newPlayer = player;
                Player.update({_id:player._id}, player, function(err,num) {
                    res.send(newPlayer);
                });
            }else{
                Player.create({
                    id: req.body.id,
                    name: req.body.name,
                    token: uuidv1(),
                    score: 0,
                    play: 0,
                    right_score: 0,
                    right_result: 0,
                    wrong_result: 0
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

exports.getPlayerRank = async function(req, res) {
    if (!req.query.id) {
        throw new Error("id is required");
    }
    
    var players = await Player.find({}).sort({score:-1}).exec();
    var myplayer = players.find((player)=>{
        return player.id===req.query.id;
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

exports.getPlayerDetail = function(req, res) {
    res.send('NOT IMPLEMENTED: Player detail with match result list : ' + req.params.id);
};
