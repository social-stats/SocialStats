const http = require('http');
const axios = require('axios');
const express = require('express');
const router = express.Router();
var Twitter = require('twitter-node-client').Twitter;
const dotEnv = require('dotenv').config();
const TwitterFetcher = require('./twitter_fetcher');
// var twitter = new Twitter(config.twitter);

router.get('/token', (req, res, next) => {
    
    TwitterFetcher.getRequestToken().then( data => {
        res.send(`<a href=https://api.twitter.com/oauth/authorize?oauth_token=${data.token}>Sign in with twitter</a>`)
    });
});

router.get('/callback', (req, res, next) => {
    
    const oauth_token = req.query.oauth_token;
    const oauth_verifier = req.query.oauth_verifier;
    
    axios.post(`https://api.twitter.com/oauth/access_token?oauth_consumer_key=${process.env.TWITTER_CONSUMER_KEY}&oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`, {})
      .then(function (response) {
          
        res.send(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  
});
module.exports = router;