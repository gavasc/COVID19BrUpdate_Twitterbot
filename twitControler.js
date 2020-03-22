const twit = require('twit');
const config = require('./config');
const bot = new twit(config);

function postTweet(text){
    bot.post('statuses/update', { status: text }, (err, data, resp) => {
        if(err) console.log(err);
        else console.log('Post success');
    });
}

module.exports = {
    postTweet
}