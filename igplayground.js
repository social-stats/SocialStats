const express = require('express');
const router = express.Router();
const config = require('./config.json');
var FB = require('fb');
var fb = new FB.Facebook({
  autoLogAppEvents: true,
  xfbml: true,
  version: 'v3.2'
});

router.get('/', (req, res, next) => {
  res.send('<a href="' + FB.getLoginUrl({
    client_id: config.facebook.client_id,
    scope: 'email,user_likes',
    redirect_uri: config.instagram.redirect,
  })+ '">Sign in with instagram</a>')
});

router.get('/authorize', (req, res, next) => {
  res.send(req.query);
});

module.exports = router;