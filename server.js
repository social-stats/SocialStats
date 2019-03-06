const TwitterFetcher = require('./twitter_fetcher');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const express = require('express');
const http = require('http')
const app = express();
const cors = require('cors');
const playgroundRoutes = require('./twitter_playground');
const igPlaygroundRoutes = require('./igplayground');
const shceduler = require('node-schedule');
const OAuth = require('oauth');
var Twitter = require('twitter-node-client').Twitter;
const env = process.env.NODE_ENV || "development";
const port = env === 'production' ? process.env.PORT : 3000;
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

app.use('/twitter', playgroundRoutes);
app.use('/ig/', igPlaygroundRoutes);

app.get('/', (req, res) => {
    res.send('<h1>Test homepage</h1>')
});

app.get('/tos', (req, res) => {
    res.send('<h1>Mock TOS page for Facebook</h1>')
});


shceduler.scheduleJob('0 0 0 * * * *', () => {
    console.log('test');
    // socialStatsTwitter.getData();
    // socialStatsInstagram.getData();
    // socialStatsFacebook.getData();

});

http.createServer(app).listen(port, function () {
    console.log('Our project is running in ' + env + '. ', (new Date()).toString());
    console.log('running on port is runing on port ', '3000');
}).on('error', function (err) {
    console.error(JSON.stringify(err));
});