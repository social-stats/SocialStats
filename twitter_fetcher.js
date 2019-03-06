//var config = require('../uiConfig.json')[process.env.NODE_ENV || "development"];

const dotEnv = require('dotenv').config();
var Twitter = require('twitter-node-client').Twitter;

var oauth_one = function (data) {
    console.log('TOKEN', data.token)
    console.log('TOKEN_SECRET', data.token_secret);
};
const twitter_config ={
    consumerKey : process.env.TWITTER_CONSUMER_KEY,
    consumerSecret  : process.env.TWITTER_CONSUMER_SECRET,
    accessToken : process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret : process.env.TWITTER_ACCESS_TOKEN_SECRET,
    callBackUrl : process.env.CALLBACK_URL
}

var twitter = new Twitter(twitter_config);

const TwitterFetcher = {

    getRequestToken: function () {
        twitter.getOAuthRequestToken(oauth_one);
    },
    getUserTimeLine: function(){
        //twitter.getUserTimeline({ screen_name: 'DeskNibbles', count: '10'}, error, success);
    }
}

module.exports = TwitterFetcher;
