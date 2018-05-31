var express = require('express') 
var jwt = require('jsonwebtoken');
var app = require('./app');
var playerController = require('./controllers/players');
var matchController = require('./controllers/matches');
var resultController = require('./controllers/results');

var router = express.Router();

router.get(["/"], function (req, res, next) {  
    res.redirect('/signin');
})
router.get(["/signin"], function (req, res, next) {  
    res.render(req.path.split("/").join(""),{});
})
router.get(["/main"], async function (req, res, next) {
    validateToken(req,res,next, async function() {
        res.render(req.path.split("/").join(""),
            await playerController.getPlayerRankAndMatches(req,res,next));
    });
})
router.get(["/match"], async function (req, res, next) { 
    validateToken(req,res,next, async function() {
        res.render(req.path.split("/").join(""),
            await matchController.getMatchInfo(req,res,next));
    });
})
router.get(["/player"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        res.render(req.path.split("/").join(""),
            await playerController.getPlayerInfo(req,res,next));
    });
})
router.get(["/manager"], async function (req, res, next) {
    validateToken(req,res,next, async function() {   
        res.render(req.path.split("/").join(""),{});
    },true);
})
router.post(["/api/login"], playerController.login)
router.post(["/api/results"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        res.send(await resultController.updateResult(req,res,next));
    });
})
router.post(["/api/calc-match"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        res.send(resultController.calcMatch(req,res,next));
    },true);
})
router.post(["/api/calc-player"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        res.send(await resultController.calcPlayer(req,res,next));
    },true);
})
router.post(["/api/calc-all"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        res.send(await resultController.calcAll(req,res,next));
    },true);
})
router.post(["/api/sum-score"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        res.send(await resultController.sumScore(req,res,next));
    },true);
})

function validateToken(req, res, next, callback, isAdmin) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token,
            (process.env.SECRET_KEY)?process.env.SECRET_KEY:'thisisakey',
            function (err, payLoad) {
                if (err) {
                    return next(new Error('Validate token fail'));
                } else {
                    if (isAdmin) {
                        if (payLoad.status!=="M") {
                            return next(new Error('Validate admin token fail'));
                        }
                    }
                    req.payLoad = payLoad;
                    return callback();
                }
            });
    } else {
        return next(new Error('Valid token is required'));
    }
}

exports = module.exports = router;