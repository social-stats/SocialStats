const express = require('express');
const router = express.Router();
const TwitterFetcher = require('../data/twitter/twitter_fetcher');
const WeeklySnapshot = require('../models/twitter_weekly_snapshot');
const TwitterHelper = require('../data/twitter/twitter_helper');
const UserObject = require('../models/user');
const TwitterSnapshot = require('../models/twitter_snapshot');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    const userId = req.query.userid;
    console.log(userId,'n')
    WeeklySnapshot.find({user:userId}).populate('topThreeReplies topThreeFavorites topThreeRetweeted')
        .then(weeklySnaps => {
            console.log(weeklySnaps)
            res.status(200).json({
                weeklySnaps
            })
        })
});



router.post('/init', (req, res, next) => {
    const uid = req.query.uid;
    const tname = req.query.tname;
    TwitterHelper.createInitialWeeklySnapshots(uid,tname)
        .then(results => {
            console.log(results)
            res.status(201).json({
                results
            })
        })
});


module.exports = router;