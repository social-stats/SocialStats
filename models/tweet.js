const mongoose = require('mongoose');
const tweetSchema = mongoose.Schema({    
    _id: mongoose.Schema.Types.ObjectId,
    user:{type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true},
    date: {type: mongoose.Schema.Types.Date, required: true},
    likes: {type: mongoose.Schema.Types.Number, required: false},
    replies: {type: mongoose.Schema.Types.Number, required: false},
    twitter: { 
        followers: {type: mongoose.Schema.Types.Number, required: false},
        likes: {type: mongoose.Schema.Types.Number, required: false},
        posts: {type: mongoose.Schema.Types.Number, required: false},
        shares: {type: mongoose.Schema.Types.Number, required: false},
    }
});

module.exports = mongoose.model("Tweet", tweetSchema);