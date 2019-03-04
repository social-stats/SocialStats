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
  res.send(FB.getLoginUrl({
    client_id: config.facebook.client_id,
    scope: 'email,user_likes',
    redirect_uri: 'http://pbnj.io'
  }))
});

router.get('/fb/authorize', (req, res, next) => {
  res.send(req.query);
});

module.exports = router;