const axios = require('axios');
const express = require('express');
const router = express.Router();
const dotEnv = require('dotenv').config();
const TwitterFetcher = require('../twitter_fetcher');
const UserObject = require('../models/user_object');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

router.post('/', (req, res, next) => {
    console.log(req.body.username)
    UserObject.find({
        username: req.body.username
    })
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({
                    message: "username exists"
                });
            } else {
                const hash = bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new UserObject({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash,
                            companyName: req.body.companyName,
                            companyWebsite: req.body.companyWebsite,
                            companyIndustry: req.body.companyIndustry,
                            twitter : null,
                            fb: null,
                            instagram: null,
                            linkedin: null
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    success: 'user created',
                                    id: user._id
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: 'invalid username entered'
                                })
                            })
                    }
                });
            }
        });
});

router.patch('/:uid', (req,res,next) => {
    request_body_keys = Object.keys(req.body);
    console.log(request_body_keys);
    if (request_body_keys.length < 4){
        const where = {
            _id : req.params.uid
        }

        const social = ['twitter', 'fb', 'linkedin', 'instagram'];
        const tokens = ['access_token', 'name', 'token_secret', 'id'];
        const valid_request = request_body_keys.every( key => social.includes(key)
                                && Object.keys(req.body[key])
                                .every(innerKey => tokens.includes(innerKey)));
        if (valid_request){
            UserObject.updateOne({_id : req.params.uid}, {$set : req.body})
            .exec()
            .then(result => {
                res.status(201).json(req.body);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error : err
                });
    
            });
        }else{
            res.status(401).json({
                error: "invalid requst"
            })
        }
        
        
    }
});

module.exports = router;