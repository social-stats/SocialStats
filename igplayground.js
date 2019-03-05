const express = require('express');
const router = express.Router();
const dotEnv = require('dotenv').config();
var FB = require('fb');
var fb = new FB.Facebook({
  appId: process.env.FACEBOOK_APP_ID,
  autoLogAppEvents: true,
  xfbml: true,
  version: 'v3.2'
});

router.get('/', (req, res, next) => {
  res.send('<a href="' + FB.getLoginUrl({
    client_id: process.env.FACEBOOK_APP_ID,
    scope: ['email', 'user_likes', 'manage_pages', 'instagram_basic'],
    redirect_uri: process.env.FACEBOOK_REDIRECT,
    // redirect_uri: 'test.com',
  }) + '">Sign in with facebook/instagram</a>')
});

router.get('/auth', (req, res, next) => {
  res.send(req.query);
});

module.exports = router;