const path = require('path');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Twitter = require('twitter');
const env = require('../../const.config');

const streamError = require('../twitter/streamError');

const streamParameters = {
  track: 'throwbackthursday'
};
const port = process.env.PORT || 3000;
let socket;

const client = new Twitter({
  consumer_key: env.consumer_key,
  consumer_secret: env.consumer_secret,
  access_token_key: env.access_token_key,
  access_token_secret: env.access_token_secret
});

const streamFilter = function(tweet) {
  console.log(tweet.user.screen_name, ' : ' , tweet.text);
  if(!socket){
    return;
  }
  socket.emit('tweet', { message: tweet.user.screen_name + ' : ' + tweet.text });
};

client.stream('statuses/filter', streamParameters, function (stream) {
  stream.on('data', streamFilter);
  stream.on('error', streamError);
});

io.on('connection', function(_socket) {
  socket = _socket;
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../../src/index.html'));
});

server.listen(port);