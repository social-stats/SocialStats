const dotEnv = require('dotenv').config();
const TwitterFetcher = require('./twitter_fetcher');
const _ = require('lodash')
const moment = require('moment')

const mongoose = require('mongoose');
const User = require('./models/user_object');
const Tweet = require('./models/tweet');
const TwitterSnapshot = require('./models/twitter_snapshot')
const TwitterWeeklySnapshot = require('./models/twitter_weekly_snapshot')

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
const attatchRepliesToTweets = (timeLineTweets, name) => {
    //console.log(timeLineTweets)
    const tweetMap = new Map(timeLineTweets.tweets.map(tweet => [tweet.tweetId, tweet]));
    return new Promise(res => {
        TwitterFetcher.getSearchResults(`@${name}`)
            .then(result => {
                result.statuses.forEach((status, index, refArray) => {
                    if (status['in_reply_to_status_id_str']) {

                        if (tweetMap.get(status['in_reply_to_status_id_str'].toString())) {
                            var numReplies = tweetMap.get(status['in_reply_to_status_id_str'].toString()).replies++
                            tweetMap.set(status['in_reply_to_status_id_str'].toString(), {
                                ...tweetMap.get(status['in_reply_to_status_id_str'].toString()),
                                replies: numReplies
                            })
                        }
                    }
                })

                res(Array.from(tweetMap.values()))
            })
    })

}
const updateTopEntries = (list, newEntry, param) => {

    if (list.length == 3) {
        if (param == 'retweets') console.log(newEntry['retweets'])
        listValues = list.map(val => val[param])
        let minValue = Math.min(...listValues) || 0;
        if (newEntry[param] > minValue) {
            list[listValues.indexOf(minValue)] = {
                favorites: newEntry['favorites'],
                retweets: newEntry['retweets'],
                replies: newEntry['replies'],
                text: newEntry['tweet'],
                tweetId: newEntry['tweetId']
            }
        }
    } else if (list.length < 3) {
        if (newEntry[param] > 0) {

            list.push({
                favorites: newEntry['favorites'],
                retweets: newEntry['retweets'],
                text: newEntry['tweet'],
                tweetId: newEntry['tweetId'],
                replies: newEntry['replies']
            })
        }


    }

    return list
}



const TwitterScedhuler = {

    runSnapshot: () => {

        var savingPromises = []

        return TwitterHelper.getListOfClients()
            .then(results =>
                results.forEach(tc => {
                    TwitterSnapshot.find({
                            user: tc.userId,
                            date: {
                                $gte: moment().startOf('date').subtract(7, 'days')
                            }
                        }).sort({
                            date: 1
                        }) //sorted ASC
                        .exec((err, mongoSnapshots) => {

                            if (err || mongoSnapshots.length === 0) {
                                console.error('error while fetching snapshots for user', tc, err);
                                return
                            };
                            // tweet_id of the earliest tweet of the week
                            var since_id = mongoSnapshots[0].firstTweetId
                            var updatedSnapshots = {};
                            TwitterFetcher.getUserTimeline(tc.name, {
                                    since_id: parseInt(since_id)
                                })
                                .then(tl => { //tweet list
                                    const tweetMap = new Map(tl.tweets.map(tweet => [tweet.tweetId, moment(tweet.date).startOf('day').toDate().toString()]));
                                    tl.tweets.forEach(t => {

                                        var key = moment(t.date).startOf('day').toDate().toString()
                                        var prevObj = updatedSnapshots[key] || {
                                            favorites: 0,
                                            retweets: 0,
                                            posts: 0,
                                            replyPosts: 0,
                                            mentions: 0,
                                            firstTweetUnix: moment().add(1, 'days').unix(),
                                            firstTweetId: -1
                                        };
                                        updatedSnapshots[key] = {
                                            ...prevObj,
                                            favorites: prevObj.favorites + t.favorites,
                                            // posts: prevObj.posts + 1,
                                            retweets: prevObj.retweets + t.retweets,
                                            firstTweetUnix: prevObj.firstTweetUnix < moment(t.date).unix() ? prevObj.firstTweetUnix : moment(t.date).unix(),
                                            firstTweetId: prevObj.firstTweetUnix < moment(t.date).unix() ? prevObj.firstTweet : t.tweetId
                                        }

                                        if (t.isReply) updatedSnapshots[key].replyPosts = prevObj.replyPosts + 1;
                                        else updatedSnapshots[key].posts = prevObj.posts + 1;

                                        // IMPORTANT: only update the object's followers if it is the current day.
                                        if (key === moment().startOf('day').toDate().toString())
                                            updatedSnapshots[key].followers = t.tw_user.followers_count;
                                    })

                                    TwitterFetcher.getSearchResults(`@${tc.name}`)
                                        .then(results => {

                                            console.log('results.statuses', results.statuses.length);

                                            results.statuses.forEach(t => {
                                                if (t.text.toUpperCase().includes(`@${tc.name.toUpperCase()}`)) {
                                                    var key = moment(t.created_at).startOf('day').toDate().toString()

                                                    console.log(key)

                                                    var prevObj = updatedSnapshots[key] || {
                                                        favorites: 0,
                                                        retweets: 0,
                                                        posts: 0,
                                                        replyPosts: 0,
                                                        mentions: 0,
                                                        firstTweetUnix: moment().add(1, 'days').unix(),
                                                        firstTweetId: ''
                                                    }
                                                    updatedSnapshots[key] = {
                                                        ...prevObj,
                                                        mentions: prevObj.mentions + 1,
                                                    };

                                                } else {
                                                    console.log(t.text)
                                                }
                                            })
                                        }).then(() => {
                                            // for every updated snapshot that belongs to user tc.userId,
                                            // we are going to find the corresponding TwitterSnapshot object from the array (mongo)
                                            Object.keys(updatedSnapshots).forEach(date => {

                                                var updatedSnapshot = updatedSnapshots[date]

                                                //delete the firstTweetUnix value from the object... this is no longer needed.
                                                delete updatedSnapshot.firstTweetUnix

                                                var correspondingSnapshot = mongoSnapshots.filter(ms => {
                                                    return ((moment(ms.date).toDate().toString() === date) && (ms.user.toString() === tc.userId.toString()))
                                                })[0] || null;

                                                if (!correspondingSnapshot) return;

                                                savingPromises.push(new Promise((resolve, reject) => {
                                                    TwitterSnapshot.findOneAndUpdate(
                                                        //filter :
                                                        {
                                                            _id: correspondingSnapshot._id
                                                        },
                                                        //find one with the filter and update the fields:
                                                        updatedSnapshot, {
                                                            upsert: true,
                                                            setDefaultsOnInsert: true
                                                        }
                                                    ).exec((err, res) => {
                                                        if (err) {
                                                            console.log('Saving snapshot error', err, 'User: ', tc);
                                                            reject(err)
                                                        }
                                                        resolve(res);
                                                        return;
                                                    })
                                                }))
                                            })
                                        })

                                })
                        })
                })
            ).then(() => {
                return Promise.all(savingPromises)
                    .then(saveResult => {
                        return saveResult
                    })
                    .catch(e => {
                        return e
                    })
            })
    },
    // runIntialSnapshot is a promise
    runInitialSnapshot: (userId, twitterHandle) => {
        twitterHandle = twitterHandle || 'desknibbles'
        return TwitterFetcher.getUserTimeline(twitterHandle)
            .then(tl => {
                var snapshots = {};
                tl.tweets.forEach(t => {
                    var key = moment(t.date).startOf('day').toDate().toString()

                    var prevObj = snapshots[key] || {
                        favorites: 0,
                        retweets: 0,
                        posts: 0,
                        replyPosts: 0,
                        firstTweetUnix: moment().add(1, 'days').unix(),
                        firstTweetId: -1 - 1
                    };
                    snapshots[key] = {
                        ...prevObj,
                        favorites: prevObj.favorites + t.favorites,
                        retweets: prevObj.retweets + t.retweets,
                        firstTweetUnix: prevObj.firstTweetUnix < moment(t.date).unix() ? prevObj.firstTweetUnix : moment(t.date).unix(),
                        firstTweetId: prevObj.firstTweetUnix < moment(t.date).unix() ? prevObj.firstTweet : t.tweetId
                    }

                    if (t.isReply) snapshots[key].replyPosts = prevObj.replyPosts + 1;
                    else snapshots[key].posts = prevObj.posts + 1;
                })

                Object.keys(snapshots).forEach(date => {
                    //the keys of all the snapshots are dates
                    const newTwitterSnapshot = new TwitterSnapshot({
                        _id: new mongoose.Types.ObjectId(),
                        date: date,
                        user: userId,
                        favorites: snapshots[date].favorites,
                        posts: snapshots[date].posts,
                        replyPosts: snapshots[date].replyPosts,
                        retweets: snapshots[date].retweets,
                        firstTweetId: snapshots[date].firstTweetId
                    })
                    return newTwitterSnapshot.save();
                })
            })
    },
    updateWeeklySnapshots: () => {

        User.find({})
            .then(clients => {
                clients.forEach(client => {
                    TwitterFetcher.getUserTimeline(client.twitter.name, {
                            created: true
                        })
                        .then(tl => {
                            attatchRepliesToTweets(tl, client.twitter.name)
                                .then(updatedTweets => {
                                    //const tweetMap = new Map(tweets.map(tweet => [tweet.tweetId, tweet]));
                                    TwitterWeeklySnapshot.find({
                                            user: client._id
                                        })
                                        .populate('topThreeRetweeted topThreeFavorites topThreeReplies')
                                        .then(weekly => {
                                            Tweet.find({
                                                    name: client.twitter.name
                                                })
                                                .then(dbTweets => {
                                                    var dbTweetMap = new Map(dbTweets.map(tweet => [tweet.tweetId, tweet]));
                                                    var dbWeeklyMap = new Map(weekly.map(db => [db.date, db]));



                                                    // var timelineTweetList = Array.from(tweetMap.values())
                                                    updatedTweets.forEach(tweet => {
                                                        var key = moment(tweet.date).startOf('week').toDate()
                                                        var objectFromDb = dbWeeklyMap.get(key)
                                                        console.log(dbWeeklyMap, "WEEKLYMAP")
                                                        if (objectFromDb) {
                                                            //console.log('yaaaas')
                                                            dbWeeklyMap.set(key, {
                                                                ...dbWeeklyMap.get(key),
                                                                topThreeFavorites: updateTopEntries(objectFromDb.topThreeFavorites, tweet, 'favorites'),
                                                                topThreeRetweets: updateTopEntries(objectFromDb.topThreeRetweets, tweet, 'retweets'),
                                                                topThreeReplies: updateTopEntries(objectFromDb.topThreeReplies, tweet, 'replies'),


                                                            })
                                                        } else {
                                                            dbWeeklyMap.set(key, {
                                                                new: true,
                                                                topThreeFavorites: [],
                                                                topThreeRetweets: [],
                                                                topThreeRepliedToTweets: [],
                                                                user: tl.userId,
                                                                date: key
                                                            })
                                                        }
                                                    })
                                                    console.log('here')
                                                    // save new tweets
                                                    var weekList = Array.from(dbWeeklyMap.values())
                                                    var newTweets = []
                                                    var oldTweets = []
                                                    weekList.forEach(weekObject => {
                                                        Object.keys(weekObject).forEach(key => {
                                                            if (key == 'topThreeReplies' || key == 'topThreeFavorites' || key == 'topThreeRetweets') {
                                                                weekObject[key].forEach(tweet => {
                                                                    console.log(tweet)
                                                                    // if (!dbTweetMap.get(tweet._id)) {// db tweets have _id
                                                                    //     newTweets.push(new Tweet({
                                                                    //         _id: new mongoose.Types.ObjectId(),
                                                                    //         tweetId: tweet.tweetId,
                                                                    //         name: handle,
                                                                    //         date: k,
                                                                    //         favorites: tweet.favorites,
                                                                    //         replies: tweet.replies,
                                                                    //         retweets: tweet.retweets,
                                                                    //         text: tweet.text
                                                                    //     }).save())
                                                                    // } else
                                                                    //     {
                                                                    //         oldTweets.push(Tweet.findByIdAndUpdate())
                                                                    //         console.log('here')
                                                                    //     }
                                                                })
                                                            }
                                                        })
                                                    })
                                                    var tweetPromiseList = []

                                                    // Object.keys(weekMap).forEach(k => {
                                                    //     Object.keys(weekMap[k]).forEach(param =>{
                                                    //         if(param == 'topThreeRepliedToTweets' || param == 'topThreeFavorites' || param == 'topThreeRetweets'){
                                                    //         weekMap[k][param] 
                                                    //             .forEach((tweet,index,refArray) =>{

                                                    //                 refArray[index] = new Tweet ({
                                                    //                 _id: new mongoose.Types.ObjectId(),
                                                    //                 tweetId: tweet.tweetId,
                                                    //                 name: handle,
                                                    //                 date: k,
                                                    //                 favorites: tweet.favorites,
                                                    //                 replies: tweet.replies,
                                                    //                 retweets: tweet.retweets,
                                                    //                 text: tweet.text
                                                    //                 })
                                                    //                 tweetPromiseList.push(refArray[index].save())
                                                    //                 refArray[index] = refArray[index]._id
                                                    //             })   
                                                    //         }             
                                                    //     })
                                                    // })

                                                })
                                        })
                                })


                            // console.log(tweetMap.get('1109108341333057536').replies)



                        })


                })
                // update replies
                // getusertimeline today - 7days
                // pull snap from past week
                // updates
                // getSearchResults

            })
    },
    createInitialWeeklySnapshots: (userId, handle) => {
        TwitterFetcher.getUserTimeline(handle)
            .then(tl => {
                var weekMap = {}
                const tweetMap = new Map(tl.tweets.map(tweet => [tweet.tweetId, moment(tweet.date).startOf('week').toDate().toString()]));
                attatchRepliesToTweets(tl, handle)
                    .then(tweets => {

                        tweets.forEach(t => {
                            if (t.replies) console.log('ALSO HERE', t)
                            //t['replies'] = replyMap.get(t.tweetId)
                            var key = moment(t.date).startOf('week').toDate();
                            // if key in map, 
                            var weekObject = weekMap[key] || {
                                topThreeFavorites: [],
                                topThreeRetweeted: [],
                                topThreeReplies: [],
                                user: userId,
                                date: key
                            }
                            weekMap[key] = {
                                ...weekObject,
                                topThreeFavorites: updateTopEntries(weekObject.topThreeFavorites, t, 'favorites'),
                                topThreeRetweeted: updateTopEntries(weekObject.topThreeRetweeted, t, 'retweets'),
                                topThreeReplies: updateTopEntries(weekObject.topThreeReplies, t, "replies")
                            }


                        })

                        var tweetPromiseList = []
                        Object.keys(weekMap).forEach(k => {
                            Object.keys(weekMap[k]).forEach(param => {
                                if (param == 'topThreeReplies' || param == 'topThreeFavorites' || param == 'topThreeRetweeted') {
                                    weekMap[k][param]
                                        .forEach((tweet, index, refArray) => {
                                            refArray[index] = new Tweet({
                                                _id: new mongoose.Types.ObjectId(),
                                                tweetId: tweet.tweetId,
                                                name: handle,
                                                date: k,
                                                favorites: tweet.favorites,
                                                replies: tweet.replies,
                                                retweets: tweet.retweets,
                                                text: tweet.text
                                            })
                                            tweetPromiseList.push(refArray[index].save())
                                            refArray[index] = refArray[index]._id
                                        })
                                }
                            })
                        })
                        var weekPromiseList = []
                        Promise.all(tweetPromiseList).then(res => {
                            Object.keys(weekMap).forEach(k => {
                                try {
                                    var weekSnap = new TwitterWeeklySnapshot({
                                        ...weekMap[k],
                                        _id: new mongoose.Types.ObjectId()
                                    })
                                } catch (err) {
                                    console.log('ERROR, err')
                                }
                                weekPromiseList.push(weekSnap.save())


                            })
                            Promise.all(weekPromiseList).then(res => {
                                // TwitterWeeklySnapshot.find()
                                // .populate('topThreeRetweeted topThreeFavorites').then((err,db) => console.log(db,err))
                            })
                        })



                    })


                // LOGGING WEEKMAP


            })
    }
}

module.exports = TwitterScedhuler;