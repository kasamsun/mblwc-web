const express = require('express') ;
const jwt = require('jsonwebtoken');
var app = require('./app');
var playerController = require('./controllers/player-controller');
var matchController = require('./controllers/match-controller');
var resultController = require('./controllers/result-controller');
var commentController = require('./controllers/comment-controller');

var router = express.Router();

const errorHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        return next(err);
    });
};
router.get(["/"], function (req,res) {  
    res.redirect('/signin');
})
router.get(["/team"], errorHandler(async (req,res) => {
    res.render(req.path.split("/").join(""),{});
}))
router.get(["/help"], function (req,res) {  
    res.render(req.path.split("/").join(""),{});
})
router.get(["/signin"], function (req,res) {  
    res.render(req.path.split("/").join(""),{});
})
router.get(["/signinx"], function (req,res) {  
    res.render(req.path.split("/").join(""),{});
})
router.get(["/main"], errorHandler(async (req,res) => {
    await validateToken(req,res); 
    res.render(req.path.split("/").join(""),
        await playerController.getPlayerRankAndMatches(req,res));
}))
router.get(["/match"], errorHandler(async (req,res) => {
    await validateToken(req,res); 
    res.render(req.path.split("/").join(""),
        await matchController.getMatchInfo(req,res));
}))
router.get(["/player"], errorHandler(async (req,res) => {
    await validateToken(req,res); 
    res.render(req.path.split("/").join(""),
        await playerController.getPlayerInfo(req,res));
}))
router.get(["/comment"], errorHandler(async (req,res) => {
    await validateToken(req,res); 
    res.render(req.path.split("/").join(""),
        await commentController.getComments(req,res));
}))
router.get(["/manager"], errorHandler(async (req,res) => {
    await validateToken(req,res,true); 
    res.render(req.path.split("/").join(""),{});
}))

router.post(["/api/login"], errorHandler(async (req,res) => {
    await validateSignRequest(req,res);
    res.json(await playerController.login(req,res));
}))
router.post(["/api/results"], errorHandler(async (req,res) => {
    await validateToken(req,res);
    res.json(await resultController.updateResult(req,res));
}))
router.post(["/api/comments"], errorHandler(async (req,res) => {
    await validateToken(req,res);
    res.json(await commentController.addComment(req,res));
}))
router.post(["/api/players"], errorHandler(async (req,res) => {
    await validateToken(req,res);
    res.json(await playerController.updatePlayer(req,res));
}))
router.post(["/api/calc-match"], errorHandler(async (req,res) => {
    await validateToken(req,res,true);
    res.json(await resultController.calcMatch(req,res));
}))
router.post(["/api/calc-all"], errorHandler(async (req,res) => {
    await validateToken(req,res,true);
    res.json(await resultController.calcAll(req,res));
}))
router.post(["/api/sum-score"], errorHandler(async (req,res) => {
    await validateToken(req,res,true);
    res.json(await resultController.sumScore(req,res));
}))

function validateToken(req, res, isAdmin) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token,
            (process.env.SECRET_KEY)?process.env.SECRET_KEY:'thisisakey',
            function (err, payLoad) {
                if (err) {
                    throw new Error('Validate token fail');
                } else {
                    if (isAdmin) {
                        if (payLoad.status!=="M") {
                            throw new Error('Validate admin token fail');
                        }
                    }
                    req.payLoad = payLoad;
                    return;
                }
            });
    } else {
        throw new Error('Valid token is required');
    }
}

function validateSignRequest(req, res) {
    var signedRequest = req.body.signed_request;
    if (signedRequest) {
        var userID = verifyFB(signedRequest,'582329818791668');
        if (!userID) {
            throw new Error('Validate signed request fail');
        } else if (userID!=req.body.id) {
            throw new Error('Validate signed request user fail');
        }
        return;
    } else {
        throw new Error('Signed request is required');
    }
}

// modules
var inspect = require('eyes').inspector(),
    b64url = require('b64url'),
    crypto = require('crypto');

function verifyFB(signedRequest, appId) {
    var secret = '191580d2272b49e95ca1fcfa651f9550';
    if (!secret) {
        inspect({ request: signedRequest, appId: appId }, 'Invalid FB App ID');
        return false;
    }

    var split = signedRequest.split('.');
    var encodedSig = split[0];
    var payload = split[1];
    var sig = b64url.decode(encodedSig, 'binary');
    var expectedSig = crypto.createHmac('sha256', secret).update(payload).digest();
    var fbPayload = JSON.parse(b64url.decode(payload));
    return fbPayload.user_id;
}

exports = module.exports = router;