var R = require ('request');

var key = 'ql0CMxD8jHkkNmjo1ZSky18Jz'; // 	Consumer Key (API Key)
var secret = 'N588dg0j9ClUaUheNrComH0mOUD3YTjBh5hsmiRHtQt8waXXTa'; // Consumer Secret (API Secret)
var cat = key + ':' + secret;
var credentials = new Buffer (cat).toString('base64')

var url = 'https://api.twitter.com/oauth2/token';

var createToken = function (callback) {

    R ({
        url: url,
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + credentials,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: 'grant_type=client_credentials'
    }, function (err, resp, body) {
        if (err) {
            console.log('ERROR REQUESTING THE BEARER TOKEN')
            callback(err, null)
        } else {
            console.log('BEARER TOKEN OBTAINED')

            callback(null, JSON.parse(body).access_token)
        }
    })
}

module.exports = {
    createBearerToken: createToken
}