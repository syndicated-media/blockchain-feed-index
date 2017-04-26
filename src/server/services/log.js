var log = function (message) {
  console.log(message);
}

log.error = function (err) {
  console.error(err);
}

module.exports = log;
