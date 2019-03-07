const mongoose = require('mongoose');
const userObjectSchema = mongoose.Schema({    
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: mongoose.Schema.Types.String, required: true},
    password: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    twitter: { 
        access_token: {type: mongoose.Schema.Types.String, required: true},
        handle: {type: mongoose.Schema.Types.String, required: true}
    },
    fb: {
        access_token: {type: mongoose.Schema.Types.String, required: false},
        page_name: {type: mongoose.Schema.Types.String, required: false}
    },
    linkedin: {
        access_token: {type: mongoose.Schema.Types.String, required: false},
        name: {type: mongoose.Schema.Types.Number, required: false} 
    },
    instagram: {
        access_token: {type: mongoose.Schema.Types.String, required: false},
        page_name: {type: mongoose.Schema.Types.String, required: false}
    },
});

module.exports = mongoose.model("UserObject", userObjectSchema);