const Twitter = require('twitter');
const env = require('../../const.config');
const app = require('../express/app');
const io = require('socket.io')(app.server);

const streamError = require('./streamError');

const streamParameters = {
  track: 'happynewabels'
};

const client = new Twitter({
  consumer_key: env.consumer_key,
  consumer_secret: env.consumer_secret,
  access_token_key: env.access_token_key,
  access_token_secret: env.access_token_secret
});


const streamFilter = function(tweet) {
  console.log(chalk.green(tweet.user.screen_name, ' : ' , tweet.text));

  io.on('connection', function(socket) {
    socket.emit('tweet', { message: tweet.user.screen_name + ' : ' + tweet.text });
  });
};

client.stream('statuses/filter', streamParameters, function (stream) {
  stream.on('data', streamFilter);
  stream.on('error', streamError);
});