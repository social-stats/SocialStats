const axios = require('axios');
const express = require('express');
const router = express.Router();
const dotEnv = require('dotenv').config();
const TwitterFetcher = require('../data/twitter/twitter_fetcher');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

router.post('/', (req, res, next) => {
    console.log('proxy')
    User.find({
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
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash,
                            companyName: req.body.companyName,
                            companyWebsite: req.body.companyWebsite,
                            companyIndustry: req.body.companyIndustry,
                            twitter: null,
                            fb: null,
                            instagram: null,
                            linkedin: null
                        });
                        user.save()
                            .then(result => {
                                console.log(result)
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

router.post('/login', (req, res, next) => {
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Auth failed'
                });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err || !result) {
                        res.status(401).json({
                            message: 'Auth failed'
                        });
                    } else {
                        const token = jwt.sign({
                            username: user[0].username,
                            userId: user[0]._id
                        },
                            "secret",
                            {
                                expiresIn: "1h"
                            }
                        );
                        res.status(200).json({
                            message: 'Login Successful',
                            token: token,
                            uid: user[0]._id
                        });
                    }

                });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

router.patch('/:uid', (req, res, next) => {
    request_body_keys = Object.keys(req.body);
    if (request_body_keys.length < 4) {
        const where = {
            _id: req.params.uid
        }

        
        const social = ['twitter', 'fb', 'linkedin', 'instagram'];
        const tokens = ['accessToken', 'name', 'tokenSecret', 'id'];
        const valid_request = request_body_keys.every(key => social.includes(key)
            && Object.keys(req.body[key])
                .every(innerKey => tokens.includes(innerKey)));
        if (valid_request) {
            User.updateOne({ _id: req.params.uid }, { $set: req.body })
                .exec((err, results) => {
                    if (err)
                        return res.status(500).json({
                            error: err
                        });
                    console.log('req.body', req.body);  
                    return res.status(201).json(req.body);
                })
        } else {
            res.status(401).json({
                error: "invalid requst"
            })
        }
    }
});


router.post('/login', (req, res) => {
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Auth failed'
                });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err || !result) {
                        res.status(401).json({
                            message: 'Auth failed'
                        });
                    } else {
                        const token = jwt.sign({
                            username: user[0].username,
                            userId: user[0]._id
                        },
                            "secret",
                            {
                                expiresIn: "1h"
                            }
                        );
                        res.status(200).json({
                            message: 'Login Successful',
                            token: token,
                            uid: user[0]._id
                        });
                    }

                });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        })
})


module.exports = router;