var http = require('http');
var querystring = require('querystring');
var bodyParser = require('koa-body');
var compose = require('koa-compose');
var pathModel = require('../models/path_model');
var Router = require('koa-router');


var httpRequest = function(options) {
  return new Promise(function(resolve, reject) {
    var path = options.query ? options.path + '?' + querystring.stringify(options.query)
                             : options.path;
    var params = {
      host: options.host || 'localhost',
      port: options.port || 1340,
      method: options.method || 'GET',
      path: path
    };

    var req = http.request(params, function(res) {
      var body = '';
      res.on('data', function(data) {
        body += data;
      });

      res.on('end', function() {
        resolve(JSON.parse(body));
      });
    })

    req.on('error', function(err) {
      reject(err);
    });

    if (params.method !== 'GET' && options.body) {
      req.write(options.body);
    };

    req.end();
  });
};


var api = new Router({
  prefix: '/api'
});


api.get('/order', function*(next) {
  var query = {
    id: this.query.id,
    quantity: this.query.quantity,
    user: this.query.user
  };

  var paths = yield pathModel(this.db).readList({});
  var response = yield paths.map(function(path) {
    return httpRequest({
      host: path.host,
      port: path.post,
      method: path.method,
      path: path.path,
      query: query
    });
  });

  this.body = JSON.stringify(response);
  yield next;
});

api.post('/register_path', function*(next) {
  var pathData = {
    host: this.query.host,
    port: this.query.port,
    method: this.query.method,
    path: this.query.path
  };

  var path = yield pathModel(this.db).create(pathData);
  this.body = path;
  yield next;
});

api.post('/accounting', function*(next) {
  this.body = JSON.stringify(
    'Order by $USER accounted!'.replace('$USER', this.query.user)
  );
  yield next;
});

api.post('/store/reserve', function*(next) {
  this.body = JSON.stringify(
    '$Q of $ID reserved!'.replace('$Q', this.query.quantity).replace('$ID', this.query.id)
  );
  yield next;
});

api.get('/path1', function*(next) {
  this.body = JSON.stringify('GET path1');
  yield next;
});

api.get('/path2', function*(next) {
  this.body = JSON.stringify('GET path2');
  yield next;
});

api.get('/path3', function*(next) {
  this.body = JSON.stringify('GET path3');
  yield next;
});

api.post('/path1', function*(next) {
  this.body = JSON.stringify('POST path1');
  yield next;
});

api.post('/path2', function*(next) {
  this.body = JSON.stringify('POST path2');
  yield next;
});

api.post('/path3', function*(next) {
  this.body = JSON.stringify('POST path3');
  yield next;
});

var apiRouter = function*(next) {
  if (/^\/api/.test(this.path)) {
    yield compose([api.routes(), api.allowedMethods()]).call(this, next);
  } else {
    yield next;
  }
};


module.exports = apiRouter;
