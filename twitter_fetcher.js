//var config = require('../uiConfig.json')[process.env.NODE_ENV || "development"];

const dotEnv = require('dotenv').config();
var Twitter = require('twitter-node-client').Twitter;

var oauth_one = (data) => {
    console.log('TOKEN', data.token)
    console.log('TOKEN_SECRET', data.token_secret);
};
const twitter_config = {
    consumerKey : process.env.TWITTER_CONSUMER_KEY,
    consumerSecret  : process.env.TWITTER_CONSUMER_SECRET,
    accessToken : process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret : process.env.TWITTER_ACCESS_TOKEN_SECRET,
    callBackUrl : process.env.CALLBACK_URL
}

var twitter = new Twitter(twitter_config);

const TwitterFetcher = {
    getRequestToken: () => {
        twitter.getOAuthRequestToken(oauth_one);
    },
    getUserTimeLine: () => { //aka User Profile
        // twitter.getUserTimeline({ screen_name: 'DeskNibbles', count: '10'}, error, success);
    },
    getFollowers: () => {
      twitter.getUserTimeline({
        screen_name: 'DeskNibbles',
        count: 2
      }, (e) => {
        console.log('get user TL err', e);
      }, (result) => {
        var numFollowers = JSON.parse(result)[0].user.followers_count;
        // console.log('success cb: ', result)
        // console.log('first elem: ', result[0])
        console.log('Followers: ', numFollowers)
      });
    },
    getMentionsTimeLine: () => {
      twitter.getMentionsTimeline({
        count: 10
      }, (e) => {
        console.log('get mentions TL err', e)
      }, (result) => {
        console.log('Mentions: ', result)
      });
    },
    getRetweetsOfMe: () => {
      twitter.getReTweetsOfMe({
        include_user_entities: true
      }, (e) => {
        console.log('retweets of me err: ', e)
      }, (result) => {
        console.log('Tweets that have been retweeted: ', result)
      })
    },
    getTrendsNearMe: (woeid) => {
      twitter.getCustomApiCall('/trends/place.json', {
        id: woeid
      }, (e) => {
        console.log('get trends near me err: ', e)
      }, (result) => {
        console.log('get trends near me: ', result)
      })
    },
    getSearchResults: (searchQuery) => {
      twitter.getSearch({
        q: searchQuery,
        count: 10
      }, (e) => {
        console.log('search err: ', e)
      }, (result) => {
        console.log('Search Results: ', result)
      })
    },
}

module.exports = TwitterFetcher;
