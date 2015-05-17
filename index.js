var debug = require('debug')('app:www');
var koa = require('koa');
var logger = require('koa-logger');
var etag = require('koa-etag');
var fresh = require('koa-fresh');
var error = require('./middlewares/error');
var apiRouter = require('./middlewares/api_router');

var app = koa();
var port = process.env.PORT || 1340;

app.use(error);

if (process.env.DEBUG) {
  app.use(logger());
}

app.use(fresh());
app.use(etag());

app.use(apiRouter);

var server = app.listen(port, function() {
  debug('Koa server listening on port ' + server.address().port);
});
