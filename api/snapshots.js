const express = require('express');
const router = express.Router();
const TwitterFetcher = require('../data/twitter/twitter_fetcher');
const TwitterHelper = require('../data/twitter/twitter_helper');
const UserObject = require('../models/user');
const TwitterSnapshot = require('../models/twitter_snapshot');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    const uid = req.query.uid;
    TwitterSnapshot.find({ user: uid })
        .exec((err, docs) => {
            if (err)
                return res.status(500).json({ error: { message: 'Error retrieving snapshots' } })
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
            return res.status(200).json({ response: ret, err: err })
        })
});

router.post('/init', (req, res, next) => {
    const uid = req.query.uid;
    const tname = req.query.tname;
    TwitterHelper.runInitialSnapshot(uid, tname).then(results => res.status(201).json({ success: "Created snapshots" }))
        .catch(e => res.status(500).json({ error: { message: 'Error saving snapshots' } }))
});

module.exports = router;