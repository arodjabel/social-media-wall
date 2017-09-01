const chalk = require('chalk');

const streamError = function(err) {
  console.log(chalk.red(err));
};

module.exports = streamError;