var debug = require('debug')('app:error');
var HTTPStatus = require('http-status');

var error = function*(next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;

    this.body = HTTPStatus[this.status];

    debug({
      status: this.status,
      message: err.message,
      debug: err.debug
    });

    this.app.emit('error', err, this);
  }
};

module.exports = error;
