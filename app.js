var express = require('express')  
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var playerController = require('./controllers/players');
var matchController = require('./controllers/matches');

var db_url = "mongodb://127.0.0.1:27017/mblwc";
if (process.env.APP_ENV==='PRD'){
    db_url = "mongodb://mblwc:mblwc@ds133550.mlab.com:33550/mblwc";
    //db_url = "mongodb://uezo1pgaabt2y1o:Aj3Ms6vC16UL7OKJjN56@bnjo0mjdq69bryf-mongodb.services.clever-cloud.com:27017/bnjo0mjdq69bryf";
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
app.set('view engine', 'pug')
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get(["/"], function (req, res) {  
    res.redirect('/signin');
})
app.get(["/signin"], function (req, res) {  
    res.render(req.path.split("/").join(""),{})
})
app.get(["/main"], async function (req, res) {
    var result = await playerController.getPlayerRank(req,res);
    var result2 = await matchController.getMatches(req,res);
    result.matches = result2;
    res.render(req.path.split("/").join(""),result);
})

app.get(["/test"], function (req, res) {  
    res.render(req.path.split("/").join(""),{})
})
app.get(["/testanim"], function (req, res) {  
    res.render(req.path.split("/").join(""),{})
})
app.post(["/api/login"], playerController.login)

app.use(errorHandler);

app.listen(8080, function () {
    console.log('App listening on port 8080')
})

function errorHandler (err, req, res, next) {
    res.status(500)
    res.render('error', { error_message: err })
}
  
exports = module.exports = app;
exports = module.exports = mongoose;