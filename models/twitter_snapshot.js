const mongoose = require('mongoose');
const twitterSnapshotSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: mongoose.Schema.Types.Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserObject', required: true },
    followers: { type: mongoose.Schema.Types.Number, required: false },
    favorites: { type: mongoose.Schema.Types.Number, required: false },
    posts: { type: mongoose.Schema.Types.Number, required: false },
    replyPosts: { type: mongoose.Schema.Types.Number, required: false },
    retweets: { type: mongoose.Schema.Types.Number, required: false },
    mentions: { type: mongoose.Schema.Types.Number, required: false },
    firstTweetId: { type: mongoose.Schema.Types.String, required: false }
});

module.exports = mongoose.model("TwitterSnapshot", twitterSnapshotSchema);