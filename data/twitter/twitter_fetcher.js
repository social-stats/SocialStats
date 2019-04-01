//var config = require('../uiConfig.json')[process.env.NODE_ENV || "development"];

const dotEnv = require('dotenv').config();
var Twitter = require('twitter-node-client').Twitter;
const axios = require('axios');
const moment = require('moment')
const twitter_config = {

  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: '1093514095976886273-s7HQWwShY4b7MvPjCrVnvmdwPdSxAK',
  accessTokenSecret: 'AnUyYZNz6thaMJjTIVsKwJFi8ivl30IxoTXIc9vGxE8QI',
  callBackUrl: process.env.TWITTER_CALLBACK_URL
}

var twitter = new Twitter(twitter_config);

const client_service = (token = null) => {
  const defaultOptions = {
    headers: {
      Authorization: token ? `${token}` : '',
    },
  };

  return {
    get: (url, options = {}) => axios.get(url, { ...defaultOptions, ...options }),
    post: (url, data, options = {}) => axios.post(url, data, { ...defaultOptions, ...options }),
    put: (url, data, options = {}) => axios.put(url, data, { ...defaultOptions, ...options }),
    delete: (url, options = {}) => axios.delete(url, { ...defaultOptions, ...options }),
  };
};

const TwitterFetcher = {

  getRequestToken: function () {
    return new Promise((res) => twitter.getOAuthRequestToken(data => {
      res(data)
    }));
  },

  getHomeTimeline: (client) => {
    const twitter_client = new Twitter(client)

    // console.log('HERE', client[0].consumerKey)
    // const request = client_service(`OAuth oauth_consumer_key="9wkjjUziuqqsHMPyEzB2PKKQd",oauth_token="1093514095976886273-s7HQWwShY4b7MvPjCrVnvmdwPdSxAK",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1552270993",oauth_nonce="tuCvTVNXJ5S",oauth_version="1.0",oauth_signature="zyY1jbcQeJ%2Bk6cYAcx10%2BWLDhzE%3D"`);
    // request.get('https://api.twitter.com/1.1/statuses/home_timeline.json').then(x => console.log(x))
    return new Promise((res) =>
      twitter_client.getHomeTimeline({
        count: 200
      }, (e) => {
        console.log('get mentions TL err', e)
      }, (result) => {
        JSON.parse(result).map(twitter_object => {
          res({
            tweet: twitter_object.text,
            favorites: twitter_object.favorite_count,
            retweets: twitter_object.retweet_count,
            id: twitter_object.id,
            date: twitter_object.created_at.toString()
          })

        })
      }))
  },
  getUserTimeline: (name, params) => {

    params = params || {};

    return new Promise((res) => {
      const tweets = []

      twitter.getUserTimeline({
        screen_name: name,
        count: 2000
      }, (e) => {
        console.log('get user TL err', name);
      }, (result) => {
        const jsonResult = JSON.parse(result);

        jsonResult.forEach(tweet_object => {
          if (params.since_id) {
            if (params.since_id <= tweet_object.id)

              tweets.push({
                tw_user: tweet_object.user,
                tweet: tweet_object.text,
                favorites: tweet_object.favorite_count,
                retweets: tweet_object.retweet_count,
                tweetId: tweet_object.id_str,
                date: tweet_object.created_at,
                name: name,
                isReply: tweet_object.in_reply_to_status_id !== null,
                replies: 0
              })

          } else if(params.created){
              if(params.created ){
                var sevenDays = moment().startOf('date').subtract(7, 'days')
                if(moment(tweet_object.created_at).isAfter(sevenDays)){
                  tweets.push({
                    tw_user: tweet_object.user,
                    tweet: tweet_object.text,
                    favorites: tweet_object.favorite_count,
                    retweets: tweet_object.retweet_count,
                    tweetId: tweet_object.id_str,
                    date: tweet_object.created_at,
                    name: name,
                    isReply: tweet_object.in_reply_to_status_id !== null,
                    replies:0
                  })
                }
              }
            
          }
          else{
            tweets.push({
              tw_user: tweet_object.user,
              tweet: tweet_object.text,
              favorites: tweet_object.favorite_count,
              retweets: tweet_object.retweet_count,
              tweetId: tweet_object.id_str,
              date: tweet_object.created_at,
              name: name,
              isReply: tweet_object.in_reply_to_status_id !== null,
              replies: 0
            })
          }
        })

      res({
        followers: jsonResult[0].user.followers_count,
        tweets: tweets,
        userId: jsonResult[0].user.id_str
      })

    }
      //const numFollowers = JSON.parse(result)[0].user.followers_count;
      //console.log('Followers: ', numFollowers)

    )
  });
  },
getMentionsTimeLine: (client) => {
  client.getMentionsTimeline({
    count: 10
  }, (e) => {
    console.log('get mentions TL err', e)
  }, (result) => {
    console.log('Mentions: ', result)
  });
},
  getRetweetsOfMe: () => {
    twitter.getReTweetsOfMe({
      include_user_entities: true
    }, (e) => {
      console.log('retweets of me err: ', e)
    }, (result) => {
      console.log('Tweets that have been retweeted: ', result)
    })
  },
    getTrendsNearMe: (woeid) => {
      twitter.getCustomApiCall('/trends/place.json', {
        id: woeid
      }, (e) => {
        console.log('get trends near me err: ', e)
      }, (result) => {
        console.log('get trends near me: ', result)
      })
    },
      getSearchResults: (searchQuery) => {
        return new Promise(res => {
          twitter.getSearch({
            q: searchQuery,
            count: 200
          }, (e) => {
            console.log('search err: ', e)
          }, (result) => {
            res(JSON.parse(result))
          })
        })

      },
}

module.exports = TwitterFetcher;
