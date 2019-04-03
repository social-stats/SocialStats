
const axios = require('axios');
const express = require('express');
const router = express.Router();
const User = require('../models/user')
const TwitterFetcher = require('../data/twitter/twitter_fetcher');
const checkAuth = require('./middleware/check_auth')
// var twitter = new Twitter(config.twitter);

//will be deprecated soon
//the UI will eliminate the need for this call.
router.get('/token', (req, res, next) => {
    TwitterFetcher.getRequestToken().then(data => {
        res.send(`<a href=https://api.twitter.com/oauth/authorize?oauth_token=${data.token}>Sign in with twitter</a>`)
    });
});

router.get('/callback', checkAuth, (req, res, next) => {
    console.log('query', req.query);
    const oauthToken = req.query.oauth_token;
    const oauthVerifier = req.query.oauth_verifier;
    const userId = req.query.userId;
    axios.post(`https://api.twitter.com/oauth/access_token?oauth_consumer_key=${process.env.TWITTER_CONSUMER_KEY}&oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`, {})
        .then(function (response) {
            const responseList = response.data.split('=');
            User.findOneAndUpdate({ _id: userId }, {
                twitter: {
                    accessToken: responseList[1].substring(0, responseList[1].indexOf('&')),
                    tokenSecret: responseList[2].substring(0, responseList[2].indexOf('&')),
                    name: responseList[4]
                }
            }).exec((err, result) => {
                if (err) {
                    console.error('Error while saving twitter token', err)
                    return res.send(500).json({ error: { message: "Could not save Twitter credentials." } })
                }
                return res.send(201).json({ success: { message: "Successfully authorized Twitter credentials" } })
            })
        })
});

module.exports = router;