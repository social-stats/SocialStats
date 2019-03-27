
const axios = require('axios');
const express = require('express');
const router = express.Router();
const dotEnv = require('dotenv').config();
const TwitterFetcher = require('../twitter_fetcher');
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
        const response_list = response.data.split('=');
        console.log(response_list);

        res.send({
            access_token : response_list[1].substring(0, response_list[1].indexOf('&')),
            token_secret : response_list[2].substring(0, response_list[2].indexOf('&')),
            id: response_list[3].substring(0,response_list[3].indexOf('&')),
            name: response_list[4]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  
});
module.exports = router;