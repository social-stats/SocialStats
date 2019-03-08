
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

          const res_string = response.data;
          const screen_name = res_string.substring(res_string.lastIndexOf('='), res_string.length);
          console.log(screen_name);
          console.log(res_string);
        res.send({
            oauth_token : res_string.substring(res_string.indexOf('=') + 1,res_string.indexOf('&'))

        });
      })
      .catch(function (error) {
        console.log(error);
      });
  
});
module.exports = router;