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
    callBackUrl : process.env.TWITTER_CALLBACK_URL
}

var twitter = new Twitter(twitter_config);

const TwitterFetcher = {
    getRequestToken: function () {
        console.log(twitter_config);
        return new Promise((res) => twitter.getOAuthRequestToken( data => {
            res(data)
            // console.log('TOKEN', data.token)
            // console.log('TOKEN_SECRET', data.token_secret);
        }));
    },
    getUserTimeLine: function(){
    //     twitter.getUserTimeline({ screen_name: 'DeskNibbles', count: '10'}, error, success);
    },
    getFollowers: () => {
      twitter.getUserTimeline({
        screen_name: 'DeskNibbles',
        count: '2'
      }, (e) => {
        console.log('error', e);
      }, (result) => {
        var numFollowers = JSON.parse(result)[0].user.followers_count;
        // console.log('success cb: ', result)
        // console.log('first elem: ', result[0])
        console.log(numFollowers)
      });
    },
}

module.exports = TwitterFetcher;
