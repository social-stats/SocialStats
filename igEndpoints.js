var config = require('./config.json');

const IGEndpoints = {

    getAuthURI: function () {
        var redirectURI = 'herokuapp.something redirect catcher something';
        return 'https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=' + redirectURI + '&response_type=code'
    },
    getAccessToken: function () {
        fetch('https://api.instagram.com/oauth/access_token')
    },


}

module.exports = IGEndpoints;