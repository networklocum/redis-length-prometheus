var express = require("express");
var app = express();

//Config file with security key for GET endpoint
var config = require('./config.json');

var redis = require('redis').createClient({
  host:process.env.REDIS_HOST,
  port:6379
});

var METRIC = "redis_queue_size"

app.get('/metrics', function (req, res) {

  metrics = "# TYPE redis_queue_size counter\n";
  processed = 0;
  total = 0;

  function finish() {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.write(metrics);
    res.end();
  }
  function keyLength(key) {
    redis.llen(key, function (error, size) {
      if (error) { }
      else metrics += METRIC + '{queue="' + key + '"}' + " " + size + "\n";
      processed++;

      if (processed >= total) finish();
    });
  };

  redis.keys("*", function (error, keys) {
    total = keys.length;
    keys.forEach(keyLength);
  });
});

app.listen(process.env.PORT);

console.log("Rest API started on http://localhost:" + process.env.PORT);
