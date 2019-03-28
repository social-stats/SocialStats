const express = require('express');
const router = express.Router();
const TwitterFetcher = require('../data/twitter/twitter_fetcher');
const TwitterHelper = require('../data/twitter/twitter_helper');
const UserObject = require('../models/user');
const TwitterSnapshot = require('../models/twitter_snapshot');
const mongoose = require('mongoose');
const twitter_weekly_schema = require('../models/twitter_weekly_snapshot');

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
    TwitterSnapshot.find().exec((err, docs) => res.status(201).json({ response: docs, err: err }))
});

module.exports = router;