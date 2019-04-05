const mongoose = require('mongoose');
const userObjectSchema = mongoose.Schema({    
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: mongoose.Schema.Types.String, required: true},
    password: { type: mongoose.Schema.Types.String, required: true },
    companyName: { type: mongoose.Schema.Types.String, required: true },
    companyWebsite: { type: mongoose.Schema.Types.String, required: true },
    companyIndustry: { type: mongoose.Schema.Types.String, required: true },
    twitter: { 
        accessToken: {type: mongoose.Schema.Types.String, required: false},
        tokenSecret: {type: mongoose.Schema.Types.String, required: false},
        name: {type: mongoose.Schema.Types.String, required: false},
        id: {type: mongoose.Schema.Types.String, required: false}
    },
    fb: {
        accessToken: {type: mongoose.Schema.Types.String, required: false},
        name: {type: mongoose.Schema.Types.String, required: false}
    },
    linkedin: {
        accessToken: {type: mongoose.Schema.Types.String, required: false},
        name: {type: mongoose.Schema.Types.Number, required: false} 
    },
    instagram: {
        accessToken: {type: mongoose.Schema.Types.String, required: false},
        name: {type: mongoose.Schema.Types.String, required: false}
    },
});

module.exports = mongoose.model("UserObject", userObjectSchema);