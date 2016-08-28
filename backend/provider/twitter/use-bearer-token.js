var R = require('request'),
    events = require('events'),
    util = require('util');
    Promise = require("bluebird");

var twitterToken = require('./create-bearer-token');


function tweetsGenerator () {
    this._url =  url = 'https://api.twitter.com/1.1/search/tweets.json';
    this._intervals = {};
    this.tweets = []
    this._ready()
}

var token = new Promise(function(resolve, reject) {
    twitterToken.createBearerToken(function (err, body){
        if (body) {
            resolve(body);
        } else {
            reject('Failure!');
        }
    })

});


util.inherits(tweetsGenerator, events.EventEmitter);

tweetsGenerator.prototype._ready = function () {
    //this.emit( 'ready' )

}

tweetsGenerator.prototype._parseData = function ( data, callback ) {
    // do stuff with data
    var tweets = data.statuses
    var self = this
    this.tweets = tweets.map(function(item){
        return {'text': item.text}
    })

    callback(null, this.tweets)
}

tweetsGenerator.prototype._getTweets = function (token, cityName, callback) {
    var self = this
    function getTweets (token, cityName, callback) {
        R({
            url: url,
            method: 'GET',
            qs: {
                'q': '%23'+cityName, // %23 for the hashtag
                'lang': 'en',
                'count': 100
            },
            json: true,
            headers: {
                'Authorization': "Bearer " + token
            }
        }, function(err, resp, body) {

            if (err) {
                console.log('ERROR IN CALLING THE API')
                callback(err, null)
            } else {
                if (!body.errors) {
                    console.log('BEARER TOKEN SUCCESSFULLY CONSUMED')
                    self._parseData(body, callback)

                } else {
                    console.log('ERROR WHILE USING THE BEARER TOKEN', body)
                    callback(body, null)
                }
            }
        })
    }
    getTweets(token, cityName, function(err, result){
        callback(err, result)
    })
}

tweetsGenerator.prototype.__getTweets = function (cityName, fn) {
    var self = this
    token.then(function(token){
                var getTweets = self._getTweets.bind(self, token, cityName, fn)
        self._intervals [cityName] = setInterval(getTweets, 20000)
        self._getTweets(token, cityName, fn)
    })
}

tweetsGenerator.prototype.getTweets = function (cityName, callback) {
    this.__getTweets(cityName, callback)
}

tweetsGenerator.prototype.discardTweets = function (cityName) {
    clearInterval( this._intervals[ cityName ] );
    delete this._intervals[ cityName ];
}

module.exports = tweetsGenerator