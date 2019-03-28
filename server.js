
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
const test = require('./api/test');
const twitter_helper = require('./twitter_helper');
const app = express();


//mongo
mongoose.connect(env === "production" ? process.env.MONGO_URL : process.env.MONGO_DEV_URL, { useNewUrlParser: true })

// ------------------------------
// EXPRESS SET UP BEGIN
// ------------------------------
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
// ------------------------------
// EXPRESS SET UP END
// ------------------------------

// ------------------------------
// EXPRESS ROUTING
// ------------------------------
app.use('/twitter', twitterPlaygroundRoutes);
app.use('/ig/', igPlaygroundRoutes); //TODO: delete this later
app.use('/user', user);
app.use('/test', test);
// ------------------------------
// EXPRESS ROUTING END
// ------------------------------

// ------------------------------
// EXPRESS SERVE AND ENDPOINTS
// ------------------------------
app.get('/', (req, res) => {
    res.send('<h1><i>ss Test homepage</i></h1>')
});

app.get('/tos', (req, res) => {
    res.send('<h1>Mock TOS page for Facebook</h1>')
});
// EXPRESS SERVE END


// ------------------------------
// SCHEDULER
// ------------------------------
// twitter_helper.initiateTwitterScedhuling();
// TwitterFetcher.getFollowers();
// TwitterFetcher.getMentionsTimur fcked loleLine();
// TwitterFetcher.getRetweetsOfMe();
// TwitterFetcher.getTrendsNearMe(3369); //ottawa WOEID: 3369 (global trends, use id: 1)
// TwitterFetcher.getSearchResults('desk nibbles');

shceduler.scheduleJob('30 23 * * * *', () => {
    console.log('Scheduler is running');
    // socialStatsTwitter.getData(); //socialStatsTwitter == twitter_fetcher.js
    // socialStatsInstagram.getData();
    // socialStatsFacebook.getData();
    console.log('Scheduler ended');
});

// twitter_helper.runInitialSnapshot('test');

// ------------------------------
// SCHEDULER end
// ------------------------------


twitter_helper.createInitialWeeklySnapshots('5c9a9f455f503a43d1d8b595','DeskNibbles');
// ------------------------------
// CREATE HTTP SERVER
// ------------------------------
http.createServer(app).listen(port, () => {
    console.log('Our project is running in ' + env + '. ', (new Date()).toString());
    console.log('running on port is runing on port ', port);
}).on('error', (err) => {
    console.error(JSON.stringify(err));
});
// ------------------------------
// CREATE HTTP SERVER END
// ------------------------------
