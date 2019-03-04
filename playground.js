const express = require('express');
const router = express.Router();
var Twitter = require('twitter-node-client').Twitter;
var twitter = new Twitter(config.twitter);

router.get('/', (req, res, next) => {
    console.log('query ', req.query); 
        
        twitter.getOAuthAccessToken({
            token: process.env.TOKEN,
            token_secret: process.env.TOKEN_SECRET,
            verifier: req.query.oauth_verifier
        }, (err, res) => {
            console.log('err', err);
            console.log('res', res);
    
            if (res) {
                twitter.getMentionsTimeline();
            }
        });

});

module.exports = router;