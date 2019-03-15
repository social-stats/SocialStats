const mongoose = require('mongoose');
const userObjectSchema = mongoose.Schema({    
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: mongoose.Schema.Types.String, required: true},
    password: { type: mongoose.Schema.Types.String, required: true },
    twitter: { 
        access_token: {type: mongoose.Schema.Types.String, required: false},
        token_secret: {type: mongoose.Schema.Types.String, required: false},
        name: {type: mongoose.Schema.Types.String, required: false},
        id: {type: mongoose.Schema.Types.String, required: false}
    },
    fb: {
        access_token: {type: mongoose.Schema.Types.String, required: false},
        name: {type: mongoose.Schema.Types.String, required: false}
    },
    linkedin: {
        access_token: {type: mongoose.Schema.Types.String, required: false},
        name: {type: mongoose.Schema.Types.Number, required: false} 
    },
    instagram: {
        access_token: {type: mongoose.Schema.Types.String, required: false},
        name: {type: mongoose.Schema.Types.String, required: false}
    },
});

module.exports = mongoose.model("UserObject", userObjectSchema);