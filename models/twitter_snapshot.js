const mongoose = require('mongoose');
const twitterSnapshotSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: mongoose.Schema.Types.Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followers: { type: mongoose.Schema.Types.Number, required: false },
    favorites: { type: mongoose.Schema.Types.Number, required: false },
    posts: { type: mongoose.Schema.Types.Number, required: false },
    retweets: { type: mongoose.Schema.Types.Number, required: false },
    replies: { type: mongoose.Schema.Types.Number, required: false },
    firstTweet: { type: mongoose.Schema.Types.Number, required: false },
    mostRetweeted: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true },
    firstTweetId: { type: mongoose.Schema.Types.Number, required: false }
    //most liked tweet
    // most retweeted tweet of the day
    // most replied to tweet of the day

});

module.exports = mongoose.model("TwitterSnapshot", twitterSnapshotSchema);