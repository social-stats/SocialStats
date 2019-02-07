const mongoose = require('mongoose')

const config = require('./config.json');
const OAuth = require('oauth');
var Twitter = require('twitter-node-client').Twitter;

//Callback functions
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
    console.log(body)
};
var success = function (data) {
    console.log('Data [%s]', data);
};

var twitter = new Twitter(config.twitter);

//Get this data from your twitter apps dashboard


// make a directory in the root folder of your project called data
// copy the node_modules/twitter-node-client/twitter_config file over into data/twitter_config`
// Open `data/twitter_config` and supply your applications `consumerKey`, 'consumerSecret', 'accessToken', 'accessTokenSecret', 'callBackUrl' to the appropriate fields in your data/twitter_config file



twitter.getUserTimeline({ screen_name: 'DeskNibbles', count: '10'}, error, success);
	
twitter.getTweet({ id: '1111111111'}, error, success);
	
	//
	// Get 10 tweets containing the hashtag haiku
	//

	

