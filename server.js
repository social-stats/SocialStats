
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const express = require('express');
const http = require('http')
const cors = require('cors');
const twitterPlaygroundRoutes = require('./api/twitter_playground');
const igPlaygroundRoutes = require('./igplayground');
const shceduler = require('node-schedule');
const env = process.env.NODE_ENV || "development";
const port = env === 'production' ? process.env.PORT : 3000;
const dotEnv = require('dotenv').config();
const user = require('./api/user');
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
const twitter_helper = require('./twitter_helper');
const app = express();

var corsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept', 'token', 'content-type'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/twitter', twitterPlaygroundRoutes);
app.use('/ig/', igPlaygroundRoutes);
app.use('/user', user);
app.get('/', (req, res) => {
    res.send('<h1><i>ss Test homepage</i></h1>')
});

app.get('/tos', (req, res) => {
    res.send('<h1>Mock TOS page for Facebook</h1>')
});
// twitter_helper.initiateTwitterScedhuling();
// TwitterFetcher.getFollowers();
// TwitterFetcher.getMentionsTimeLine();
// TwitterFetcher.getRetweetsOfMe();
// TwitterFetcher.getTrendsNearMe(3369); //ottawa WOEID: 3369 (global trends, use id: 1)
// TwitterFetcher.getSearchResults('desk nibbles');

//twitter_helper.getListOfClients();
shceduler.scheduleJob('0 0 0 * * * *', () => {
    console.log('Scheduler is running');
    // socialStatsTwitter.getData(); //socialStatsTwitter == twitter_fetcher.js
    // socialStatsInstagram.getData();
    // socialStatsFacebook.getData();
    console.log('Scheduler ended');
});

twitter_helper.runInitialSnapshot('test');

http.createServer(app).listen(port, () => {
    console.log('Our project is running in ' + env + '. ', (new Date()).toString());
    console.log('running on port is runing on port ', '3000');
}).on('error', (err) => {
    console.error(JSON.stringify(err));
});
