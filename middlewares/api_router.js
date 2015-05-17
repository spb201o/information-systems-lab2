var http = require('http');
var querystring = require('querystring');
var bodyParser = require('koa-body');
var compose = require('koa-compose');
var Router = require('koa-router');


var httpRequest = function(options) {
  return new Promise(function(resolve, reject) {
    var path = options.query ? options.path + '?' + querystring.stringify(parameters)
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

    if (options.body) {
      req.write(options.body);
    };

    req.end();
  });
};


var api = new Router({
  prefix: '/api'
});

api.use(bodyParser());


api.get('/gather', function*(next) {
  var response = yield ['/api/path1', '/api/path2', '/api/path3'].map(function(path) {
    return httpRequest({
      path: path
    });
  });
  this.body = JSON.stringify(response);
  yield next;
});


api.get('/path1', function*(next) {
  this.body = JSON.stringify('Hi there!');
  yield next;
});

api.get('/path2', function*(next) {
  this.body = JSON.stringify('What up?');
  yield next;
});

api.get('/path3', function*(next) {
  this.body = JSON.stringify('Kthxbye!');
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
