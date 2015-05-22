DROP TABLE paths;

CREATE TABLE paths (
  id serial primary key,
  host text not null,
  port int not null default 80,
  method text not null default 'GET',
  path text not null default '/'
);

INSERT INTO paths (host, port, method, path) VALUES ('localhost', 1340, 'POST', '/api/accounting');
INSERT INTO paths (host, port, method, path) VALUES ('localhost', 1340, 'POST', '/api/store/reserve');
INSERT INTO paths (host, port, method, path) VALUES ('localhost', 1340, 'GET', '/api/path1');
INSERT INTO paths (host, port, method, path) VALUES ('localhost', 1340, 'POST', '/api/path2');
