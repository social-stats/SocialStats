const mongoose = require('mongoose');
const twitterWeeklySnapshotSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: mongoose.Schema.Types.Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstTweetId: { type: mongoose.Schema.Types.Number, required: false },
    topThreeLiked: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: false}],
    topThreeRetweeted: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: false}],
    topThreeReplied: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: false}]
});

module.exports = mongoose.model("WeeklySnapshot", twitterWeeklySnapshotSchema);