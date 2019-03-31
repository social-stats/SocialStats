const mongoose = require('mongoose');
const Tweet = require('./tweet');
const twitterWeeklySnapshotSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: mongoose.Schema.Types.Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   
    topThreeRetweeted: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: false}],
    topThreeFavorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: false}],
    topThreeReplies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: false}]
});

module.exports = mongoose.model("WeeklySnapshot", twitterWeeklySnapshotSchema);