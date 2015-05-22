var pathMap = function(row) {
  return {
    id: row['id'],
    host: row['host'],
    port: row['port'],
    method: row['method'],
    path: row['path']
  };
};

var pathModel = function(db) {
  return {
    create: function(pathData) {
      return db.query(
          'insert into paths (host, port, method, path) ' +
          'values ($1, $2, $3, $4) returning *',
          [pathData.host, pathData.port, pathData.method, pathData.path]
        )
        .then(function(paths) {
          return paths.map(pathMap)[0];
        }, function(reason) {
          var err = new Error('Database error');
          err.debug = reason;
          throw err;
        });
    },

    readList: function(filterData) {
      return db.query(
          'select * from paths order by paths.id offset $1 limit $2',
          [filterData.offset, filterData.limit]
        )
        .then(function(paths) {
          return paths.map(pathMap);
        }, function(reason) {
          var err = new Error('Database error');
          err.debug = reason;
          throw err;
        });
    },
  };
};

module.exports = pathModel;
