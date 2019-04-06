const express = require('express');
const router = express.Router();
const TwitterFetcher = require('../data/twitter/twitter_fetcher');
const TwitterHelper = require('../data/twitter/twitter_helper');
const UserObject = require('../models/user');
const TwitterSnapshot = require('../models/twitter_snapshot');
const mongoose = require('mongoose');

router.get('/init', (req, res, next) => {
    TwitterHelper.runInitialSnapshot(req.query.userId, req.query.twitterHandle)
        .then((err, saveResult) => res.status(201).json({ response: saveResult, err: err }))
});

router.get('/runsnap', (req, res, next) => {
    TwitterHelper.runSnapshot(req.query.userId, req.query.twitterHandle)
        .then(saveResult => {
            if (saveResult.err)
                return res.status(500).json({ err: saveResult.err })
            return res.status(201).json({ response: saveResult })
        })
});


router.get('/snapshots', (req, res, next) => {
    TwitterSnapshot.find().exec((err, docs) => {
        var ret = docs.map(d => {
            return {
                date: d.date || 0,
                favorites: d.favorites || 0,
                posts: d.posts || 0,
                replyPosts: d.replyPosts || 0,
                retweets: d.retweets || 0,
                mentions: d.mentions || 0
            }
        })
        res.status(201).json({ response: ret, err: err })
    })
});

router.get('/users', (req, res, next) => {
    UserObject.find({}).exec((err, users) => {res.send(users)})
})

module.exports = router;