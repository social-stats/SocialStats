const mongoose = require('mongoose');
const snapshotSchema = mongoose.Schema({    
    _id: mongoose.Schema.Types.ObjectId,
    date: {type: mongoose.Schema.Types.Date, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    twitter: { 
        followers: {type: mongoose.Schema.Types.Number, required: false},
        likes: {type: mongoose.Schema.Types.Number, required: false},
        posts: {type: mongoose.Schema.Types.Number, required: false},
        shares: {type: mongoose.Schema.Types.Number, required: false},
    },
    fb: { 
    },
    linkedin: { 
    },
    instagram: {
    },
});

module.exports = mongoose.model("Snapshot", snapshotSchema);