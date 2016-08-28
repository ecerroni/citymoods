var R = require ('request');

var appId = 'info@enricocerroni.com'

var credentials = new Buffer (appId).toString('base64')

var url = 'http://www.sentiment140.com/api/bulkClassifyJson';

var getSentiment = function (sentimentObj, callback) {

    R ({
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'appid': appId // credentials
        },
        body: JSON.stringify(sentimentObj)
    }, function (err, resp, body) {
        if (err) {
            console.log('ERROR REQUESTING THE 140 TOKEN')
            callback(err, null)
        } else {
            //console.log('140 SENTIMENT OBTAINED', err, body)

            callback(null, body)
        }
    })
}

module.exports = {
    getSentiment: getSentiment
}