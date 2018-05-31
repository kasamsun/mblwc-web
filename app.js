var express = require('express')  
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var playerController = require('./controllers/players');
var matchController = require('./controllers/matches');
var resultController = require('./controllers/results');

var db_url = "mongodb://127.0.0.1:27017/mblwc";
if (process.env.APP_ENV==='PRD'){
    //db_url = "mongodb://mblwc:mblwc@ds133550.mlab.com:33550/mblwc";
    db_url = "mongodb://uezo1pgaabt2y1o:Aj3Ms6vC16UL7OKJjN56@bnjo0mjdq69bryf-mongodb.services.clever-cloud.com:27017/bnjo0mjdq69bryf";
}
console.log(db_url);
mongoose.connect(db_url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database Connection Status: ' + 
    mongoose.connection.readyState);
});

app.locals.moment = require('moment');
app.locals._ = require('underscore');
app.set('view engine', 'pug')
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get(["/"], function (req, res, next) {  
    res.redirect('/signin');
})
app.get(["/signin"], function (req, res, next) {  
    res.render(req.path.split("/").join(""),{});
})
app.get(["/main"], async function (req, res, next) {
    validateToken(req,res,next, async function() {
        var result = await playerController.getPlayerRank(req,res,next);
        var result2 = await matchController.getMatches(req,res,next);
        result.matches = result2;
        res.render(req.path.split("/").join(""),result);
    });
})
app.get(["/match"], async function (req, res, next) { 
    validateToken(req,res,next, async function() {
        var matchInfo = await matchController.getMatchInfo(req,res,next);
        res.render(req.path.split("/").join(""),matchInfo);
    });
})
app.get(["/player"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        var playerInfo = await playerController.getPlayerInfo(req,res,next);
        res.render(req.path.split("/").join(""),playerInfo);
    });
})
app.get(["/manager"], async function (req, res, next) {
    validateToken(req,res,next, async function() {   
        res.render(req.path.split("/").join(""),{});
    },true);
})
app.post(["/api/login"], playerController.login)
app.post(["/api/results"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        var result = await resultController.updateResult(req,res,next);
        res.send(result);
    });
})
app.post(["/api/calc-match"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        var result = await resultController.calcMatch(req,res,next);
        res.send(result);
    },true);
})
app.post(["/api/calc-player"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        var result = await resultController.calcPlayer(req,res,next);
        res.send(result);
    },true);
})
app.post(["/api/calc-all"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        var result = await resultController.calcAll(req,res,next);
        res.send(result);
    },true);
})
app.post(["/api/sum-score"], async function (req, res, next) { 
    validateToken(req,res,next, async function() { 
        var result = await resultController.sumScore(req,res,next);
        res.send(result);
    },true);
})

app.use(function(err, req, res, next) {
    if (req.path.indexOf("/api/")>=0) {
        res.status(err.status || 500);
        res.send({
            error: {
                message: err.message
            }
        });
    } else {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});

app.listen(8080, function () {
    console.log('App listening on port 8080')
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


exports = module.exports = app;
exports = module.exports = mongoose;