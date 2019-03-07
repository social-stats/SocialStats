const express = require('express');
const router = express.Router();
var Twitter = require('twitter-node-client').Twitter;
const twitter_fetcher = require('./twitter_fetcher');
// var twitter = new Twitter(config.twitter);

router.get('/', (req, res, next) => {
    console.log('query ', req.query);

        twitter_fetcher.getOAuthAccessToken({
            token: process.env.TOKEN,
            token_secret: process.env.TOKEN_SECRET,
            verifier: req.query.oauth_verifier
        }, (err, res) => {
            console.log('err', err);
            console.log('res', res);

            if (res) {
                twitter_fetcher.getMentionsTimeline();
            }
        });

});

// router.get('/followers', (res, req, next) => {
//   console.log('step 1: get followers')
//   twitter_fetcher.getUserTimeLine().then(res =>
//     res.json()
//   )
// });

module.exports = router;
