const express = require('express');
const router = express.Router();
const TwitterFetcher = require('../data/twitter/twitter_fetcher');
const WeeklySnapshot = require('../models/twitter_weekly_snapshot');
const TwitterHelper = require('../data/twitter/twitter_helper');
const UserObject = require('../models/user');
const TwitterSnapshot = require('../models/twitter_snapshot');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    const userId = req.query.userId;
    console.log(userId,'n')
    WeeklySnapshot.find({user:userId})
        .then(dbResults => {
            res.status(200).json({
                dbResults
            })
        })
});

module.exports = router;