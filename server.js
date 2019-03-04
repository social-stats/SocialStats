
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const express = require('express');
const http = require('http')
const app = express();
const cors = require('cors');
const playgroundRoutes = require('./playground');
const igPlaygroundRoutes = require('./igplayground');

const config = require('./config.json');
const OAuth = require('oauth');
var Twitter = require('twitter-node-client').Twitter;
const port = 3000
const dotEnv = require('dotenv').config();

var corsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept', 'token', 'content-type'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/twitter/authorize', playgroundRoutes);
app.use('/ig/', igPlaygroundRoutes);

app.get('/', (req, res) => {
    res.send('<h1>WOW!!!!!!!</h1>')
});

// var twitter = new Twitter(coer = new Twitter(config.twitter);
// var success = function(data){
//     console.log("SUCCESS", data)
// }
// var oauth_one = function (data) {
//     process.env.TOKEN = data.token;
//     process.env.TOKEN_SECRET = data.token_secret;
//     console.log('process.env.TOKEN', process.env.TOKEN)
//     console.log('process.env.TOKEN_SECRET', process.env.TOKEN_SECRET)
// };


// twitter.getOAuthRequestToken(oauth_one)
    // nfig.twitter);
// var success = function(data){
//     console.log("SUCCESS", data)
// }
// var oauth_one = function (data) {
//     process.env.TOKEN = data.token;
//     process.env.TOKEN_SECRET = data.token_secret;
//     console.log('process.env.TOKEN', process.env.TOKEN)
//     console.log('process.env.TOKEN_SECRET', process.env.TOKEN_SECRET)
// };


// twitter.getOAuthRequestToken(oauth_one)
    
http.createServer(app).listen(port, function () {
    console.log('Our project is running! ', (new Date()).toString());
    console.log('running on port is runing on port ', '3000');
}).on('error', function (err) {
    console.error(JSON.stringify(err));
});