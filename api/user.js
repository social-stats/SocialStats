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
                            twitter : null,
                            fb: null,
                            instagram: null,
                            linkedin: null
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    success: 'user created'
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
        const tokens = ['access_token', 'name'];
        request_body_keys.every( key => social.includes(key)
                                && Object.keys(req.body[key]).every(innerKey => tokens.includes(innerKey)));
        const tw = {
            twitter : {
                name : "SocialStat4",
                access_token : '1093514095976886273-s7HQWwShY4b7MvPjCrVnvmdwPdSxAK'
            }
        }

        UserObject.updateOne({_id : req.params.uid}, {$set : req.body})
            .exec()
            .then(result => {
                res.status(201).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error : err
                });
    
        });
        
    }
});

module.exports = router;