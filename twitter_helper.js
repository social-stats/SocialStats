const dotEnv = require('dotenv').config();
const UserObject = require('./models/user_object');
const mongoose = require('mongoose');
const TwitterFetcher = require('./twitter_fetcher');
const TwitterHelper = {
    getListOfClients: () =>{
        const twitter_objects = [];
        return(
        UserObject
            .find()
            .select('twitter')
            .then(results =>{
                results.forEach(client =>                  
                    twitter_objects.push( {
                        consumerKey : process.env.TWITTER_CONSUMER_KEY,
                        consumerSecret  : process.env.TWITTER_CONSUMER_SECRET,
                        accessToken : client.twitter.access_token,
                        accessTokenSecret : client.twitter.token_secret,
                        callBackUrl : process.env.TWITTER_CALLBACK_URL
                    }))
                return twitter_objects;
            })
        )
    }}
const getTweets = id => {
    UserObject.find({id:id})
        .then(results =>
            console.log(results));
}
    const TwitterScedhuler = {
        
        initiateTwitterScedhuling: () => {
            
            const twitter_clients = TwitterHelper.getListOfClients()
                .then(results => 
                    results.forEach(twitter_client => {
                        TwitterFetcher.getHomeTimeline(twitter_client)
                        .then(x => console.log(x)) // get 200 most recent tweets
                        .then(getTweets())
                }))
                .then(() => console.log("hello"))
                .catch(e => console.log(e))
            
        },


    }
    






module.exports = TwitterScedhuler;