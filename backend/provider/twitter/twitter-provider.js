var deepstreamClient = require('deepstream.io-client-js');

var dsUtils = require( './node_modules/deepstream.io-client-js/src/utils/utils' );
dsUtils.isNode = false;

var tweetsGenerator = require('./use-bearer-token')

var sentiment = require('./get-sentiment')

var Promise = require('bluebird')

var tweetsGenerator = new tweetsGenerator()

var production = true;

var productionConnectionUrl = '163.172.171.82:6020'

var ds = production === true ? deepstreamClient(productionConnectionUrl) : deepstreamClient('localhost:6020');

ds.login({username: 'twitter-provider', password: 'test'}, listenForSubscription)

var checkSentiment = function (data) {

    var data = JSON.parse(data).data || []

    var polarity = {
        positive: [],
        neutral: [],
        negative: []
    }

    polarity.positive = data.filter(function (item) {
        return item.polarity == 4
    })

    polarity.neutral = data.filter(function (item) {
        return item.polarity == 2
    })

    polarity.negative = data.filter(function (item) {
        return item.polarity == 0
    })

    return polarity
}


var sentimentAnalysis = function ( sentimentObj, callback) {
    sentiment.getSentiment(sentimentObj, callback)
}

function listenForSubscription () {
    console.log('TWITTER PROVIDER READY!')
    ds.record.listen('US/.*', onSubscription)
}

function onSubscription ( recordName, isSubscribed) {
    var cityName = recordName.substring(3, recordName.length);
    console.log('DS | FOUND MATCH: ', cityName, isSubscribed)

    if (isSubscribed === false) {
        console.log('DS | NO MORE SUBS FOR" ', cityName)
        tweetsGenerator.discardTweets(cityName)
    } else {
        var record = ds.record.getRecord( recordName )
        var x = 0
        var y = 0
        switch (cityName){
            case 'chicago':
                x = 396.03972509722473
                y = 154.58363136096398
                break
            case 'boston':
                x = 543.8624655819153
                y = 124.18374955843126
                break
            case 'dallas':
                x = 363.57787
                y = 287.67106
                break
            case 'sacramento':
                x = 64.072338
                y = 161.39449
                break
            case 'denver':
                x = 227.51297
                y = 186.2757
                break
            case 'washington':
                x = 482.1143232682558
                y = 220.31280708529488
                break
            case 'miami':
                x = 501.8840511587112
                y = 353.13368339510146
                break
            case 'sanfrancisco': {
                x = 51.937305
                y = 180.76023
            }
            default:
                break

        }
        tweetsGenerator.getTweets(cityName, function (err, result) {
            if (!err) {
                var sentimentObj = {
                    data: result
                }

                sentimentAnalysis(sentimentObj, function (err, result) {
                    var polarity = checkSentiment(result)

                    console.log(cityName, 'positive: ', polarity.positive.length)
                    console.log(cityName, 'neutral: ', polarity.neutral.length)
                    console.log(cityName, 'negative: ', polarity.negative.length)
                    record.whenReady(function(){
                        var startDate = record.get('start') || new Date().toGMTString()
                        var oldPositive = record.get('positive') || 0
                        var oldNeutral = record.get('neutral') || 0
                        var oldNegative = record.get('negative') || 0
                        var timeline = record.get('timeline') || []

                        if (timeline.length>0) {
                            var diffNeutral = polarity.neutral.length - timeline[timeline.length-1][3].toString() < 0 ? polarity.neutral.length - timeline[timeline.length-1][3].toString() : ('+'+(polarity.neutral.length - timeline[timeline.length-1][3].toString()))
                            var diffNegative = polarity.negative.length - timeline[timeline.length-1][2].toString() < 0 ? polarity.negative.length - timeline[timeline.length-1][2].toString() : ('+'+(polarity.negative.length - timeline[timeline.length-1][2].toString()))
                            var diffPositive = polarity.positive.length - timeline[timeline.length-1][1].toString() < 0 ? polarity.positive.length - timeline[timeline.length-1][1].toString() : ('+'+(polarity.positive.length - timeline[timeline.length-1][1].toString()))

                        } else {
                            var diffNeutral = 0
                            var diffNegative = 0
                            var diffPositive =0

                        }
                        if (timeline.length < 600) {// pulling every 20 seconds I got 120 minutes after 600 slots
                            timeline.push(['', polarity.positive.length, polarity.negative.length, polarity.neutral.length])
                        } else {
                            timeline.shift();
                            timeline.push(['', polarity.positive.length, polarity.negative.length, polarity.neutral.length])
                        }
                        record.set({
                            name: cityName,
                            start: startDate,
                            tweets: JSON.parse(result).data.map(function(item) {
                                return item.text
                            }).slice(0, 15),
                            positive: oldPositive + polarity.positive.length,
                            positive_size: ((polarity.positive.length)/(polarity.positive.length + polarity.neutral.length + polarity.negative.length))*10,
                            neutral: oldNeutral + polarity.neutral.length,
                            neutral_size: ((polarity.neutral.length)/(polarity.positive.length + polarity.neutral.length + polarity.negative.length))*10,
                            negative: oldNegative + polarity.negative.length,
                            negative_size: ((polarity.negative.length)/(polarity.positive.length + polarity.neutral.length + polarity.negative.length))*10,
                            timeline: timeline,
                            total: oldPositive + polarity.positive.length + oldNeutral + polarity.neutral.length + oldNegative + polarity.negative.length,
                            x: x,
                            y: y,
                            diffNeutral: diffNeutral,
                            diffNegative: diffNegative,
                            diffPositive: diffPositive
                        })
                    })

                })
           }
        })
    }
}
