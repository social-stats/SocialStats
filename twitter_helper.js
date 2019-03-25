const dotEnv = require('dotenv').config();
const TwitterFetcher = require('./twitter_fetcher');
const _ = require('lodash')
const moment = require('moment')

const mongoose = require('mongoose');
const User = require('./models/user_object');
const Tweet = require('./models/tweet');
const TwitterSnapshot = require('./models/twitter_snapshot')


const TwitterHelper = {
    getListOfClients: () => {
        const twitter_objects = [];
        return (
            User
                .find()
                .select('twitter')
                .then(results => {
                    results.forEach(client =>
                        twitter_objects.push({
                            userId: client._id,
                            name: client.twitter.name,
                            id: client.twitter.id,
                            consumerKey: process.env.TWITTER_CONSUMER_KEY,
                            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
                            accessToken: client.twitter.access_token,
                            accessTokenSecret: client.twitter.token_secret,
                            callBackUrl: process.env.TWITTER_CALLBACK_URL
                        }))
                    return twitter_objects;
                })
        )
    }
}

getTweets = (id) => new Promise((res) => {


})
const updateReplies = (unfinishedTweets, name) => {
    let newTweets = unfinishedTweets.newTweets
    let updatedTweets = unfinishedTweets.updatedTweets

    let searchResultMap = new Map();
    return (


        TwitterFetcher.getSearchResults(`@${name}`)
            .then(res => {
                res.statuses.forEach(tweet => {
                    let mapResult = searchResultMap.get(tweet.in_reply_to_status_id_str)
                    if (!mapResult)
                        searchResultMap.set(tweet.in_reply_to_status_id_str, 1)
                    else {
                        mapResult++
                        searchResultMap.set(tweet.in_reply_to_status_id_str, mapResult)
                    }
                })

                newTweets.forEach(tweet => {
                    let numberOfReplies = searchResultMap.get(tweet.tweetId)
                    if (numberOfReplies) tweet['replies'] = numberOfReplies
                    else if (!tweet.hasOwnProperty('replies')) tweet['replies'] = numberOfReplies
                })

                updatedTweets.forEach(tweet => {
                    let numberOfReplies = searchResultMap.get(tweet.tweetId)
                    if (numberOfReplies) tweet['replies'] = numberOfReplies
                    else if (!tweet.hasOwnProperty('replies')) tweet['replies'] = numberOfReplies
                })

                return ({
                    newTweets: newTweets,
                    db_tweets: updatedTweets
                })
            })
    )
}
const saveTweets = (allTweets) => {
    const db_tweets = allTweets.db_tweets
    const newTweets = allTweets.newTweets

    let mongooseTweets = newTweets.map(tweet => new Tweet({
        _id: new mongoose.Types.ObjectId(),
        user: tweet.user,
        favourites: tweet.favourites,
        retweets: tweet.retweets,
        tweetId: tweet.tweetId,
        date: tweet.date
    }))
    console.log(mongooseTweets)

}
const compareTweets = (current, id) => {

    let newTweets = []
    let updatedTweets = []
    name = current.name
    console.log(current.tweets)
    return (
        Tweet
            .find()
            .exec()
            .then(results => {

                const currentTweetsMap = new Map(current.tweets.map(tweet => [tweet.tweetId, tweet]))
                const dbTweetMap = new Map(results.map(db_tweet => [db_tweet.tweetId, db_tweet]));
                current.tweets.forEach(tweet => {
                    if (!dbTweetMap.get(tweet.tweetId)) {
                        tweet['user'] = id
                        newTweets.push(tweet)
                    }

                })

                console.log(newTweets, 'THAT NEWNEW')

                results.forEach(db_tweet => {
                    tweetFound = currentTweetsMap.get(db_tweet.tweetId)
                    if (tweetFound) {
                        updatedTweets.push({
                            _id: db_tweet._id,
                            tweet: tweetFound.favourites,
                            retweets: tweetFound.retweets,
                            tweetId: tweetFound.tweetId,
                            date: tweetFound.date,
                            name: tweetFound.name
                        })
                    }
                })
                console.log(updatedTweets, 'UPDATE')



                return ({
                    newTweets: newTweets,
                    updatedTweets: updatedTweets
                })

                console.log(updatedTweets, "AIYAA")
                // let commonTweets = _.intersectionBy(results, current.tweets, 'tweetId') //find common tweets and update their values
                // current.tweets.forEach(newTweet => {
                //     if(example.find(ex => {
                //         ex.tweetId == newTweet.tweetId
                //     })){
                //         console.log("helloTHERE")
                //     }
                // })

                // results.map(db_tweet => db_tweet.)

                // let mongooseTweets = newTweets.map(tweet => new Tweet({
                //     _id: new mongoose.Types.ObjectId(),
                //     user: id,
                //     favourites: tweet.favourites,
                //     retweets: tweet.retweets,
                //     tweetId: tweet.tweetId,
                //     date: tweet.date
                // }))
                // console.log(mongooseTweets, "HERE")
            })
    )
}

const TwitterScedhuler = {
    //fetch current tweets G
    //fetch database tweets G
    // add new tweets to database G
    // update fields for tweets in database //lodash pick and merge
    //update replies to comments 
    // if tweet is 8days old or older, then delete from database
    // add tweet count, reply count to week object


    initiateTwitterScedhuling: () => {

        TwitterHelper.getListOfClients()
            .then(results =>
                results.forEach(twitter_client => {
                    // tweets in db
                    TwitterFetcher.getUserTimeline(twitter_client.name)
                        .then(tweets => compareTweets(tweets, twitter_client.userId)
                            .then(res => updateReplies(res, twitter_client.name))
                            .then(res => saveTweets(res)) // fetch replies
                            // TwitterFetcher.getUserTimeline(twitter_client.name)
                            //     .then(result => console.log(result))
                            // .then(x => console.log(x)) // get 200 most recent tweets
                            // .then(getTweets())
                        )

                    // snapshot stuff
                    TwitterFetcher.getUserTimeline(twitter_client.name)
                        .then(tweet)
                }))
            .then(() => console.log("hello"))
            .catch(e => console.log(e))
    },
    runSnapshot: () => {

        var savingPromises = []

        TwitterHelper.getListOfClients()
            .then(results =>
                results.forEach(tc => {
                    TwitterSnapshot.find({
                        user: tc.userId,
                        date: { $gt: moment().startOf('date').subtract(7, 'days') }
                    }).sort({ date: -1 })//sorted ASC
                        .exec((err, mongoSnapshots) => {
                            if (err) console.error('error while fetching snapshots for user', tc, err);
                            // tweet_id of the earliest tweet of the week
                            var since_id = mongoSnapshots[0].firstTweetId

                            var updatedSnapshots = {};

                            TwitterFetcher.getUserTimeline(tc.name, { since_id: since_id })
                                .then(tl => { //tweet list
                                    tl.tweets.forEach(t => {
                                        var key = moment(t.date).startOf('day').toDate().toString()
                                        var prevObj = updatedSnapshots[key] || {
                                            retweets: 0,
                                            posts: 0,
                                            firstTweetUnix: moment().add(1, 'days').unix(),
                                            firstTweetId: -1
                                        };
                                        updatedSnapshots[key] = {
                                            ...prevObj,
                                            posts: prevObj.posts + 1,
                                            retweets: prevObj.retweets + t.retweets,
                                            firstTweetUnix: prevObj.firstTweetUnix < moment(t.date).unix() ? prevObj.firstTweetUnix : moment(t.date).unix(),
                                            firstTweetId: prevObj.firstTweetUnix < moment(t.date).unix() ? prevObj.firstTweet : t.tweetId
                                        }

                                        // IMPORTANT: only update the object's followers if it is the current day.
                                        if (key === moment().startOf('day').toDate().toString())
                                            updatedSnapshots[key].followers = t.tw_user.followers_count;
                                    })
                                    //save here

                                    // for every updated snapshot that belongs to user tc.userId,
                                    // we are going to find the corresponding TwitterSnapshot object from the array (mongo)
                                    Object.keys(updatedSnapshots).forEach(date => {
                                        var updatedSnapshot = updatedSnapshots[date]

                                        //delete the firstTweetUnix value from the object... this is no longer needed.
                                        delete updatedSnapshot.firstTweetUnix

                                        var correspondingSnapshot = mongoSnapshots.find(ms => {
                                            return (moment(ms.date).toDate().toString() === date && ms.user === tc.userId)
                                        })[0] || null;

                                        savingPromises.push(new Promise((resolve, reject) => {

                                            TwitterSnapshot.findOneAndUpdate(
                                                //filter :
                                                { user: correspondingSnapshot.user, date: correspondingSnapshot.date },
                                                //find one with the filter and update the fields:
                                                { $set: updatedSnapshot }
                                            ).exec((err, res) => {
                                                if (err) { console.error('Saving snaoshot error', err, 'User: ', tc); reject(err) }
                                                resolve();
                                            })
                                        }))

                                    })
                                })
                        })
                })
            ).then(() => {
                Promise.all(savingPromises).then(() => console.log('Successfully gathered Twitter snapshots'))
                    .catch(err => {
                        console.error('Could not gather Twitter Snapshots', err)
                    })
            })
    },
    // runIntialSnapshot is a promise
    runInitialSnapshot: (userId, twitterHandle) => {
        twitterHandle = twitterHandle || 'desknibbles'
        TwitterFetcher.getUserTimeline(twitterHandle)
            .then(tl => {
                var snapshots = {};
                tl.tweets.forEach(t => {
                    var key = moment(t.date).startOf('day').toDate().toString()
                    var prevObj = snapshots[key] || {
                        favourites: 0,
                        retweets: 0,
                        posts: 0,
                        firstTweetUnix: moment().add(1, 'days').unix(),
                        firstTweetId: -1
                    };
                    snapshots[key] = {
                        ...prevObj,
                        favourites: prevObj.favourites + t.favourites,
                        posts: prevObj.posts + 1,
                        retweets: prevObj.retweets + t.retweets,
                        firstTweetUnix: prevObj.firstTweetUnix < moment(t.date).unix() ? prevObj.firstTweetUnix : moment(t.date).unix(),
                        firstTweetId: prevObj.firstTweetUnix < moment(t.date).unix() ? prevObj.firstTweet : t.tweetId
                    }
                })

                Object.keys(snapshots).forEach(date => {
                    //the keys of all the snapshots are dates
                    const newTwitterSnapshot = new twitterSnapshot({
                        _id: new mongoose.Types.ObjectId(),
                        date: date,
                        user: userId,
                        favorites: snapshots[date].favourites,
                        posts: snapshots[date].posts,
                        retweets: snapshots[date].retweets,
                        firstTweetId: snapshots[date].firstTweetId
                    })
                    return newTwitterSnapshot.save();
                }
                })

    })
}
}

module.exports = TwitterScedhuler;