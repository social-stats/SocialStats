const express = require('express');
const router = express.Router();
const dotEnv = require('dotenv').config();
var FB = require('fb');
var fb = new FB.Facebook({
  autoLogAppEvents: true,
  xfbml: true,
  version: 'v3.2'
});

router.get('/', (req, res, next) => {
  res.send('<a href="' + FB.getLoginUrl({
    client_id: process.env.FACEBOOK_CLIENT_ID,
    scope: 'email,user_likes',
    redirect_uri: process.env.FACEBOOK_REDIRECT,
  })+ '">Sign in with facebook/instagram</a>')
});

router.get('/authorize', (req, res, next) => {
  res.send(req.query);
});

module.exports = router;